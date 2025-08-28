import { z } from 'zod'
import type { Body, JsonSerializable, MappedMethods, Methods, Options, ServerResponse, SubscriptionHandler } from './types'

export { z } from 'zod'

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
    get(_target, method: string) {
      return async (...args: JsonSerializable[]) => {
        try {
          const context = await getContext(options?.context)
          const response = await fetch(options?.url ?? 'http://localhost:3000/api', {
            method: 'POST',
            body: JSON.stringify({
              method,
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
  method: string,
  args: JsonSerializable[],
  isSubscription: boolean,
  options?: Options,
) {
  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  const context = await getContext(options?.context)
  socket.send(
    JSON.stringify({
      method,
      data: isSubscription ? args[1] : args,
      context,
      subscription: isSubscription,
      id,
    } as Body),
  )
  return id
}

function addSubscriber(method: string, id: number, callback: SubscriptionHandler) {
  if (!subscribers[method]) {
    subscribers[method] = []
  }
  callback.id = id
  subscribers[method]?.push(callback)
}

const isSocketClosed = (socket: any) => socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING

export function socketClient<T extends ReturnType<typeof api>>(
  options?: Options,
): Promise<{ client: T; close: () => void; error: boolean }> {
  return new Promise((done) => {
    const socket = new WebSocket(options?.url ?? 'ws://localhost:3000/api')

    const handler = new Proxy({} as T, {
      get(_target, method: string) {
        return async (...args: JsonSerializable[]) => {
          if (isSocketClosed(socket)) {
            return { error: true }
          }

          const isSubscription = checkIfSubscription(args)
          const id = await sendSocketMessage(socket, method, args, isSubscription, options)

          if (isSubscription) {
            addSubscriber(method, id, args[0] as unknown as SubscriptionHandler)
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
      const {
        subscribed,
        subscribe: shouldSubscribe,
        unsubscribe,
        route: method,
        error,
        data: responseData,
        id,
        validation,
      } = data as ServerResponse

      if (handleSubscriptionConfirmation(id, method, subscribed)) {
        return
      }
      if (handleSubscriptionNotification(shouldSubscribe, method, id, error, responseData, validation)) {
        return
      }
      if (handleUnsubscribe(id, unsubscribe)) {
        return
      }

      handleMessageResponse(data)
    }

    function handleSubscriptionConfirmation(id: number, method: string, subscribed?: boolean) {
      if (subscribed && openHandlers.has(id)) {
        const openHandler = openHandlers.get(id)
        if (openHandler) {
          openHandler({
            error: false,
            unsubscribe: () => {
              socket.send(JSON.stringify({ id, unsubscribe: true, method, context: {}, subscription: false } as Body))
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
      shouldSubscribe: boolean,
      method: string,
      id: number,
      error: boolean,
      responseData: any[],
      validation?: z.ZodIssue[],
    ) {
      if (!shouldSubscribe) {
        return false
      }
      // Subscriptions can't technically be erroneous, validation errors however will be shown here.
      if (error) {
        console.log(`Erroneous subscription response received for ${method}.`)
        if (validation) {
          console.log(validation) // TODO pretty print validation messages.
        }
        return true
      }
      if (!error && subscribers[method]) {
        notifySubscribers(method, id, responseData)
        return true
      }
    }

    function handleUnsubscribe(id: number, unsubscribe = false) {
      if (unsubscribe && openHandlers.has(id)) {
        const openHandler = openHandlers.get(id)
        if (openHandler) {
          openHandler({ error: false })
          openHandlers.delete(id)
        }
        return true
      }
      return false
    }

    function notifySubscribers(method: string, id: number, responseData: any[]) {
      for (const subscriber of subscribers[method] ?? []) {
        if (id === subscriber.id) {
          subscriber(responseData.length === 1 ? responseData[0] : responseData)
        }
      }
    }

    function handleMessageResponse(data: any) {
      if (openHandlers.has(data.id)) {
        const openHandler = openHandlers.get(data.id)
        if (openHandler) {
          openHandler({ error: data.error, data: data.data })
          openHandlers.delete(data.id)
        }
      }
    }

    socket.onerror = () => {
      console.log('ERROR')
      // TODO handle offline case, client that waits until online again!
      console.error('Failed to start web socket.')
      done({ error: true, client: {} as T, close: () => null })
      // Error all open handlers.
      openHandlers.forEach((openHandler, id) => {
        openHandler({ error: true })
        openHandlers.delete(id)
      })
    }
  })
}

export function route<T extends z.ZodType[]>(...inputs: T) {
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
    return [handler, z.tuple(inputs)] as unknown as (...args: { [K in keyof T]: z.input<T[K]> }) => R
  }
}

export function subscribe<T extends z.ZodType[], U extends any[]>(...output: T) {
  // TODO can make function all internal if no filter needed.
  return (filter?: (...values: U) => boolean) => {
    // @ts-ignore zod.tuple working, but types fail...
    return [filter, z.tuple(output)] as unknown as [{ [K in keyof T]: z.infer<T[K]> }, U]
  }
}
