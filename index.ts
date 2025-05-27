import { z } from 'zod'
import type { Body, JsonSerializable, MappedMethods, Methods, Options, ServerResponse, SubscriptionHandler } from './types'

export { z }

const subscribers: Record<string, SubscriptionHandler[]> = {}

export function api<T extends Methods>(methods: T): MappedMethods<T> {
  return methods as unknown as MappedMethods<T>
}

async function getContext(context?: (() => JsonSerializable | Promise<JsonSerializable>) | JsonSerializable) {
  if (typeof context === 'function') {
    const result = context()
    return result instanceof Promise ? await result : result
  }
  return context ?? {}
}

export function client<T extends ReturnType<typeof api>>(options?: Options): T {
  return new Proxy({} as T, {
    get(_target, route: string) {
      return async (...args: JsonSerializable[]) => {
        try {
          const context = await getContext(options?.context)
          const response = await fetch(options?.url ?? 'http://localhost:3000/api', {
            method: 'POST',
            body: JSON.stringify({
              method: route,
              data: args,
              context,
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

async function sendSocketMessage(
  socket: any, // WebSocket will lead to conflict when undici-types installed.
  route: string,
  args: JsonSerializable[],
  isSubscription: boolean,
  options?: Options,
) {
  const id = Math.floor(Math.random() * 1000000)
  const context = await getContext(options?.context)
  socket.send(
    JSON.stringify({
      method: route,
      data: isSubscription ? args[1] : args,
      context,
      subscription: isSubscription,
      id,
    } as Body),
  )
  return id
}

function addSubscriber(route: string, id: number, callback: SubscriptionHandler) {
  if (!subscribers[route]) {
    subscribers[route] = []
  }
  callback.id = id
  subscribers[route]?.push(callback)
}

const isSocketClosed = (socket: any) => socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING

export function socketClient<T extends ReturnType<typeof api>>(
  options?: Options,
): Promise<{ client: T; close: () => void; error: boolean }> {
  return new Promise((done) => {
    const socket = new WebSocket(options?.url ?? 'ws://localhost:3000/api')

    const handler = new Proxy({} as T, {
      get(_target, route: string) {
        return async (...args: JsonSerializable[]) => {
          if (isSocketClosed(socket)) {
            return { error: true }
          }

          const isSubscription = checkIfSubscription(args)
          const id = await sendSocketMessage(socket, route, args, isSubscription, options)

          if (isSubscription) {
            addSubscriber(route, id, args[0] as unknown as SubscriptionHandler)
          }

          return new Promise((innerDone) => {
            openHandlers.set(id, innerDone)
          })
        }
      },
    })

    const openHandlers = new Map<number, (value: any) => void>()

    socket.onopen = () => {
      openHandlers.clear()
      done({ client: handler, close: () => socket.close(), error: false })
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data as string) // Fails with some dependencies without cast.
      const { subscribed, subscribe, unsubscribe, route, error, data: responseData, id, validation } = data as ServerResponse

      if (handleSubscriptionConfirmation(id, route, subscribed)) {
        return
      }
      if (handleSubscriptionNotification(subscribe, route, id, error, responseData, validation)) {
        return
      }
      if (handleUnsubscribe(id, unsubscribe)) {
        return
      }

      handleMessageResponse(data)
    }

    function handleSubscriptionConfirmation(id: number, route: string, subscribed?: boolean) {
      if (subscribed && openHandlers.has(id)) {
        const handler = openHandlers.get(id)
        if (handler) {
          handler({
            error: false,
            unsubscribe: () => {
              socket.send(JSON.stringify({ id, unsubscribe: true, method: route, context: {}, subscription: false } as Body))
              return new Promise((innerDone) => {
                openHandlers.set(id, innerDone)
              })
            },
          })
          openHandlers.delete(id)
        }
        return true
      }
      return false
    }

    function handleSubscriptionNotification(
      subscribe: boolean,
      route: string,
      id: number,
      error: boolean,
      responseData: any[],
      validation?: z.ZodIssue[],
    ) {
      if (!subscribe) {
        return false
      }
      // Subscriptions can't technically be erroneous, validation errors however will be shown here.
      if (error) {
        console.log(`Erroneous subscription response received for ${route}.`)
        if (validation) {
          console.log(validation) // TODO pretty print validation messages.
        }
        return true
      }
      if (!error && subscribers[route]) {
        notifySubscribers(route, id, responseData)
        return true
      }
    }

    function handleUnsubscribe(id: number, unsubscribe = false) {
      if (unsubscribe && openHandlers.has(id)) {
        const handler = openHandlers.get(id)
        if (handler) {
          handler({ error: false })
          openHandlers.delete(id)
        }
        return true
      }
      return false
    }

    function notifySubscribers(route: string, id: number, responseData: any[]) {
      for (const subscriber of subscribers[route] ?? []) {
        if (id === subscriber.id) {
          subscriber(responseData.length === 1 ? responseData[0] : responseData)
        }
      }
    }

    function handleMessageResponse(data: any) {
      if (openHandlers.has(data.id)) {
        const handler = openHandlers.get(data.id)
        if (handler) {
          handler({ error: data.error, data: data.data })
          openHandlers.delete(data.id)
        }
      }
    }

    socket.onerror = () => {
      console.log('ERROR')
      // TODO handle offline case, client that waits until online again!
      console.error('Failed to start web socket.')
      done({ error: true, client: {} as T, close: () => undefined })
      // Error all open handlers.
      openHandlers.forEach((handler, id) => {
        handler({ error: true })
        openHandlers.delete(id)
      })
    }
  })
}

export function route<T extends z.ZodTypeAny[]>(...inputs: T) {
  return <R>(
    handler: (
      options: {
        context: Record<string, any>
        error: (message: string) => void
      },
      ...args: { [K in keyof T]: z.infer<T[K]> }
    ) => R,
  ) => {
    // @ts-ignore zod.tuple working, but types fail...
    return [handler, z.tuple(inputs)] as unknown as (...args: { [K in keyof T]: z.infer<T[K]> }) => R
  }
}

export function subscribe<T extends z.ZodTypeAny[], U extends any[]>(...output: T) {
  // TODO can make function all internal if no filter needed.
  return (filter?: (...values: U) => boolean) => {
    // @ts-ignore zod.tuple working, but types fail...
    return [filter, z.tuple(output)] as unknown as [{ [K in keyof T]: z.infer<T[K]> }, U]
  }
}
