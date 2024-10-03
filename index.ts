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
