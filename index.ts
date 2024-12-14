import { type SafeParseReturnType, type ZodTypeAny, z as zod } from 'zod'
import type { Body, Handler, JsonSerializable, Methods } from './types'

type MappedMethods<T extends Methods> = {
  [K in keyof T]: T[K] extends Handler
    ? (...args: Parameters<T[K]>) => Promise<{
        error: boolean | string
        data: Awaited<ReturnType<T[K]>>
        validation?: SafeParseReturnType<any, any>
        subscribe?: (callback: (data: any) => void) => void
      }>
    : (callback: (data: any) => void) => Promise<void>
}

const subscribers: Record<string, ((data: any) => void)[]> = {}

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

export function socketClient<T extends ReturnType<typeof api>>(options?: {
  url?: string
  context?: (() => JsonSerializable) | JsonSerializable
}): Promise<{ client: T; close: () => void }> {
  return new Promise((done) => {
    const handler = new Proxy({} as T, {
      get(_target, route: string) {
        return async (...args: JsonSerializable[]) => {
          socket.send(
            JSON.stringify({
              method: route,
              data: args,
              context: typeof options?.context === 'function' ? options.context() : (options?.context ?? {}),
            } as Body),
          )

          const isSubscription = typeof args[0] === 'function'

          if (isSubscription) {
            if (!subscribers[route]) {
              subscribers[route] = []
            }
            subscribers[route]?.push(args[0] as unknown as (data: any) => void)
          }

          return new Promise((innerDone) => {
            state.message = innerDone
          })
        }
      },
    })

    const socket = new WebSocket(options?.url ?? 'ws://localhost:3000/api')
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
      if (data.subscribed === true) {
        if (state.message) {
          state.message({ error: false }) // Resolve promise to confirm subscription to client.
          resetMessage()
          return
        }
      }
      if (data.subscribe) {
        if (subscribers[data.route]) {
          for (const subscriber of subscribers[data.route] ?? []) {
            subscriber(data)
          }
        }
        return
      }
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

export function subscribe<T extends ZodTypeAny[]>(...inputs: T) {
  return [
    // @ts-ignore zod.tuple working, but types fail...
    Array.isArray(inputs) ? zod.tuple(inputs) : inputs,
  ] as unknown as undefined
}
