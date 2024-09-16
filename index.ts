import { type SafeParseReturnType, type ZodTypeAny, z as zod } from 'zod'
import type { JsonSerializable, Methods } from './types'

export function api<T extends Methods>(
  method: T,
): {
  [K in keyof T]: (
    ...args: Parameters<T[K]>
  ) => Promise<{ error: boolean; data: ReturnType<T[K]>; validation?: SafeParseReturnType<any, any> }>
} {
  return method
}

export function client<T extends ReturnType<typeof api>>(url = 'http://localhost:3000/api'): T {
  return new Proxy({} as T, {
    get(_target, route: string) {
      return async (...args: JsonSerializable[]) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ method: route, data: args }),
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

export const z = zod

export function route(inputs?: ZodTypeAny) {
  return <T extends (args: typeof inputs extends ZodTypeAny ? zod.infer<typeof inputs> : never) => any>(handler: T) => {
    return [handler, inputs] as unknown as typeof handler
  }
}
