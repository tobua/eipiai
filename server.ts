import type { ZodTypeAny } from 'zod'
import type { Body, Handler, JsonSerializable } from './types'

export async function executeHandler(handler: Handler, body: Body, setError: (message: string) => void, update?: (data: any) => void) {
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

export function validateInputs(data: JsonSerializable, inputs?: ZodTypeAny) {
  if (!inputs) {
    return
  }
  const validationResult = inputs.safeParse(data)
  if (!validationResult.success) {
    return validationResult.error.issues
  }
}

// biome-ignore lint/correctness/noUndeclaredVariables: Injected by runtime.
const isLocal = typeof Bun !== 'undefined'

export async function readBody(request: Request) {
  return isLocal ? request.body : await new Response(request.body).json()
}
