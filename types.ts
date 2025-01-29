import { type SafeParseReturnType, type ZodIssue, z } from 'zod'

export type JsonSerializable = string | number | boolean | null | { [key: string]: JsonSerializable } | JsonSerializable[]
export type Handler = (...args: any[]) => any
export type Subscription = any[]
export type SubscriptionHandler = ((...data: any[]) => void) & { id: number }
export type Methods = { [key: string]: Handler | Subscription | undefined }
export type Body = {
  method: string
  data?: JsonSerializable[]
  context?: Record<string, JsonSerializable>
  subscription?: boolean
  unsubscribe?: boolean
  id: number
}
export type ServerResponse = {
  id: number
  route: string
  error: boolean
  data: JsonSerializable[]
  subscribed?: boolean
  subscribe: boolean
  unsubscribe?: boolean
  validation?: ZodIssue[]
}

export const bodySchema = z
  .object({
    method: z.string(),
    data: z.any().optional(),
    context: z.record(z.string(), z.any()).optional(),
  })
  .required()

export type MappedMethods<T extends Methods> = {
  [K in keyof T]: T[K] extends Handler
    ? (...args: Parameters<T[K]>) => Promise<{
        error: boolean | string
        data: Awaited<ReturnType<T[K]>>
        validation?: SafeParseReturnType<any, any>
        subscribe?: (callback: (data: any) => void) => void
      }>
    : T[K] extends Subscription
      ? (callback: (data: T[K][0][0]) => void, ...filter: T[K][1]) => Promise<{ error: boolean; unsubscribe: () => Promise<void> }>
      : never
}
