import { type SafeParseReturnType, type ZodTypeAny, z as zod } from 'zod'
import type { Body, Handler, JsonSerializable, Methods, Subscription } from './types'

type MappedMethods<T extends Methods> = {
  [K in keyof T]: T[K] extends Handler
    ? (...args: Parameters<T[K]>) => Promise<{
        error: boolean | string
        data: Awaited<ReturnType<T[K]>>
        validation?: SafeParseReturnType<any, any>
        subscribe?: (callback: (data: any) => void) => void
      }>
    : T[K] extends Subscription
      ? (callback: (data: T[K][0][0]) => void, ...filter: T[K][1]) => Promise<void>
      : never
}

const subscribers: Record<string, ((...data: any[]) => void)[]> = {}

export function api<T extends Methods>(methods: T): MappedMethods<T> {
  return methods as unknown as MappedMethods<T>
}

export function client<T extends ReturnType<typeof api>>(options?: {
  url?: string
  context?: (() => JsonSerializable) | JsonSerializable
}): T {
  return new Proxy({} as T, {
    get(_target, route: string) {
      return async (...args: JsonSerializable[]) => {
        try {
          const response = await fetch(options?.url ?? 'http://localhost:3000/api', {
            method: 'POST',
            body: JSON.stringify({
              method: route,
              data: args,
              context: typeof options?.context === 'function' ? options.context() : (options?.context ?? {}),
            } as Body),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          return await response.json()
        } catch (_error) {
          return { error: true }
        }
      }
    },
  })
}

function checkIfSubscription(args: JsonSerializable[]): boolean {
  return typeof args[0] === 'function'
}

function sendSocketMessage(
  socket: WebSocket,
  route: string,
  args: JsonSerializable[],
  isSubscription: boolean,
  options?: { context?: (() => JsonSerializable) | JsonSerializable },
) {
  socket.send(
    JSON.stringify({
      method: route,
      data: isSubscription ? args[1] : args,
      context: typeof options?.context === 'function' ? options.context() : (options?.context ?? {}),
      subscription: isSubscription,
    } as Body),
  )
}

function addSubscriber(route: string, callback: (data: any) => void) {
  if (!subscribers[route]) {
    subscribers[route] = []
  }
  subscribers[route]?.push(callback)
}

export function socketClient<T extends ReturnType<typeof api>>(options?: {
  url?: string
  context?: (() => JsonSerializable) | JsonSerializable
}): Promise<{ client: T; close: () => void }> {
  return new Promise((done) => {
    const socket = new WebSocket(options?.url ?? 'ws://localhost:3000/api')

    const handler = new Proxy({} as T, {
      get(_target, route: string) {
        return async (...args: JsonSerializable[]) => {
          const isSubscription = checkIfSubscription(args)
          sendSocketMessage(socket, route, args, isSubscription, options)

          if (isSubscription) {
            addSubscriber(route, args[0] as unknown as (data: any) => void)
          }

          return new Promise((innerDone) => {
            state.message = innerDone
          })
        }
      },
    })

    const state: { message: false | ((value: any) => void) } = {
      message: false,
    }

    function resetMessage() {
      state.message = false
    }

    socket.onopen = () => {
      resetMessage()
      done({ client: handler, close: () => socket.close() })
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const { subscribed, subscribe, route, error, data: responseData } = data

      if (handleSubscriptionConfirmation(subscribed)) {
        return
      }
      if (handleSubscriptionNotification(subscribe, route, error, responseData)) {
        return
      }

      handleMessageResponse(data)
    }

    function handleSubscriptionConfirmation(subscribed: boolean) {
      if (subscribed && state.message) {
        state.message({ error: false })
        resetMessage()
        return true
      }
      return false
    }

    function handleSubscriptionNotification(subscribe: boolean, route: string, error: boolean, responseData: any[]) {
      if (error) {
        console.log(`Erroneous subscription response received for ${route}.`)
      }
      if (subscribe && subscribers[route]) {
        notifySubscribers(route, responseData)
        return true
      }
      return false
    }

    function notifySubscribers(route: string, responseData: any[]) {
      for (const subscriber of subscribers[route] ?? []) {
        subscriber(responseData.length === 1 ? responseData[0] : responseData)
      }
    }

    function handleMessageResponse(data: any) {
      if (state.message) {
        state.message({ ...data, route: undefined })
      }
      resetMessage()
    }

    socket.onerror = () => {
      if (state.message) {
        state.message({ error: true })
      }
      resetMessage()
    }
  })
}

export const z = zod

export function route<T extends ZodTypeAny[]>(...inputs: T) {
  return (
    handler: (
      options: {
        context: Record<string, any>
        error: (message: string) => void
      },
      ...args: { [K in keyof T]: zod.infer<T[K]> }
    ) => any,
  ) => {
    // @ts-ignore zod.tuple working, but types fail...
    return [handler, zod.tuple(inputs)] as unknown as (...args: { [K in keyof T]: zod.infer<T[K]> }) => ReturnType<typeof handler>
  }
}

export function subscribe<T extends ZodTypeAny[], U extends any[]>(...output: T) {
  // TODO can make function all internal if no filter needed.
  return (filter?: (...values: U) => boolean) => {
    // @ts-ignore zod.tuple working, but types fail...
    return [filter, zod.tuple(output)] as unknown as [{ [K in keyof T]: zod.infer<T[K]> }, U]
  }
}
