import type { ZodType } from 'zod'
import type { Body, Handler, JsonSerializable } from './types'

export async function executeHandler(
  handler: Handler,
  body: Body,
  setError: (message: string) => void,
  update?: (data: any) => Promise<void>,
) {
  let data = handler(
    {
      context: body.context ?? {},
      error: setError,
      update,
    },
    ...(body.data ?? []),
  )

  if (data instanceof Promise) {
    try {
      data = await data
    } catch (_error) {
      return { error: true }
    }
  }

  return data
}

export function validateInputs(data: JsonSerializable, inputs?: ZodType) {
  if (!inputs) {
    return { error: true, data: undefined }
  }
  const validationResult = inputs.safeParse(data)

  if (!validationResult.success) {
    return {
      error: true,
      data: validationResult.error.issues,
    }
  }

  return {
    error: false,
    data: validationResult.data,
  }
}
