import { t } from 'elysia'
import type { z } from 'zod'
import type { Body, Methods } from './types'

// biome-ignore lint/correctness/noUndeclaredVariables: Injected by runtime.
const isLocal = typeof Bun !== 'undefined'

async function readBody(request: Request) {
  return isLocal ? request.body : await new Response(request.body).json()
}

export function handler(methods: Methods) {
  return [
    async function post(request: Request) {
      const body = (await readBody(request)) as Body

      if (!body.method) {
        return Response.json({ error: true })
      }

      // @ts-ignore TODO type
      const [handler, inputs] = methods[body.method]
      if (inputs) {
        const validationResult = (inputs as z.ZodTypeAny).safeParse(body.data)

        if (!validationResult.success) {
          return Response.json({ error: true, validation: validationResult.error.errors })
        }
      }

      let error: string | boolean = false
      let data = handler(
        {
          context: body.context ?? {},
          error: (message: string) => {
            error = message
          },
        },
        ...body.data,
      )

      if (data instanceof Promise) {
        try {
          data = await data
        } catch (_error) {
          return Response.json({ error: true })
        }
      }

      return Response.json({ error, data })
    },
    {
      body: t.Object({
        method: t.String(),
        data: t.Any(),
        context: t.Any(),
      }),
    },
  ]
}
