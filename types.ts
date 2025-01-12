import { z } from 'zod'

export type JsonSerializable = string | number | boolean | null | { [key: string]: JsonSerializable } | JsonSerializable[]
export type Handler = (...args: any[]) => any
export type Subscription = any[]
export type Methods = { [key: string]: Handler | Subscription | undefined }
export type Body = { method: string; data?: JsonSerializable[]; context?: Record<string, JsonSerializable>; subscription?: boolean }

export const bodySchema = z
  .object({
    method: z.string(),
    data: z.any().optional(),
    context: z.record(z.string(), z.any()).optional(),
  })
  .required()
