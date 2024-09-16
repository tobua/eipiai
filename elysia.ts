import { t } from 'elysia'
import type { z } from 'zod'
import type { Methods } from './types'

// biome-ignore lint/correctness/noUndeclaredVariables: Injected by runtime.
const isLocal = typeof Bun !== 'undefined'

async function readBody(request: Request) {
  return isLocal ? request.body : await new Response(request.body).json()
}

export function handler(methods: Methods) {
  return [
    async function post(request: Request) {
      const body = (await readBody(request)) as { method: string; data: string | number[] }

      if (!body.method) {
        return Response.json({ error: true })
      }

      // @ts-ignore TODO type
      const [handler, inputs] = methods[body.method]
      if (inputs) {
        // @ts-ignore TODO type
        const validationResult = (inputs as z.ZodTypeAny).safeParse(...body.data)

        if (!validationResult.success) {
          return Response.json({ error: true, validation: validationResult.error.errors })
        }
      }

      return Response.json({ error: false, data: handler(...body.data) })
    },
    {
      body: t.Object({
        method: t.String(),
        data: t.Any(),
      }),
    },
  ]
}
