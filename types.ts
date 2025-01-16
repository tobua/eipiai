import { type ZodIssue, z } from 'zod'

export type JsonSerializable = string | number | boolean | null | { [key: string]: JsonSerializable } | JsonSerializable[]
export type Handler = (...args: any[]) => any
export type Subscription = any[]
export type Methods = { [key: string]: Handler | Subscription | undefined }
export type Body = {
  method: string
  data?: JsonSerializable[]
  context?: Record<string, JsonSerializable>
  subscription?: boolean
  id: number
}
export type ServerResponse = {
  id: number
  route: string
  error: boolean
  data: JsonSerializable[]
  subscribed?: boolean
  subscribe: boolean
  validation?: ZodIssue[]
}

export const bodySchema = z
  .object({
    method: z.string(),
    data: z.any().optional(),
    context: z.record(z.string(), z.any()).optional(),
  })
  .required()
