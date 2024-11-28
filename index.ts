import { type SafeParseReturnType, type ZodTypeAny, z as zod } from 'zod'
import type { Body, JsonSerializable, Methods } from './types'

type MappedMethods<T extends Methods> = {
  [K in keyof T]: (
    ...args: Parameters<T[K]>
  ) => Promise<{ error: boolean | string; data: Awaited<ReturnType<T[K]>>; validation?: SafeParseReturnType<any, any> }>
}

export function api<T extends Methods>(method: T): MappedMethods<T> {
  return method
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
          socket.send(JSON.stringify([route, args]))

          return new Promise((innerDone) => {
            state.message = innerDone
          })

          // const response = await fetch(options?.url ?? 'http://localhost:3000/api', {
          //   method: 'POST',
          //   body: JSON.stringify({
          //     method: route,
          //     data: args,
          //     context: typeof options?.context === 'function' ? options.context() : (options?.context ?? {}),
          //   } as Body),
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          // })

          // return await response.json()
          // return { error: false, data: route }
          // } catch (_error) {
          //   return { error: true }
          // }
        }
      },
    })

    const socket = new WebSocket(options?.url ?? 'ws://localhost:3000/api')
    const state = {
      message: (data: any) => {
        console.log('Missing handler, message ignored!', typeof data)
      },
    }

    socket.onopen = () => {
      done({ client: handler, close: () => socket.close() })
    }

    socket.onmessage = (event: { data: string }) => {
      console.log('Message from server:', event.data)
      state.message({ error: false, data: JSON.parse(event.data) })
    }

    socket.onerror = () => {
      state.message({ error: true })
    }
  })
}

export const z = zod

export function route<T extends ZodTypeAny[]>(...inputs: T) {
  return (
    handler: (
      options: { context: Record<string, any>; error: (message: string) => void },
      ...args: { [K in keyof T]: zod.infer<T[K]> }
    ) => any,
  ) => {
    // @ts-ignore zod.tuple working, but types fail...
    return [handler, zod.tuple(inputs)] as unknown as (...args: { [K in keyof T]: zod.infer<T[K]> }) => ReturnType<typeof handler>
  }
}
