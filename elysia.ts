import type Elysia from 'elysia'
import { t } from 'elysia'
import type { z } from 'zod'
import type { Body, Handler, JsonSerializable, Methods } from './types'

// biome-ignore lint/correctness/noUndeclaredVariables: Injected by runtime.
const isLocal = typeof Bun !== 'undefined'

async function readBody(request: Request) {
  return isLocal ? request.body : await new Response(request.body).json()
}

function validateInputs(data: JsonSerializable, inputs?: z.ZodTypeAny) {
  if (!inputs) {
    return
  }
  const validationResult = inputs.safeParse(data)
  if (!validationResult.success) {
    return validationResult.error.errors
  }
}

async function executeHandler(handler: Handler, body: Body, setError: (message: string) => void) {
  let data = handler(
    {
      context: body.context ?? {},
      error: setError,
    },
    ...body.data,
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

export function eipiai(routes: Methods, options?: { path?: string }) {
  if (typeof routes !== 'object') {
    console.error('"routes" passed to eipiai(routes) must be an object.')
  }

  return (eri: Elysia) => {
    const app = eri.post(
      options?.path ?? 'api',
      async function post(request: Request) {
        const body = (await readBody(request)) as Body

        if (!body.method) {
          return Response.json({ error: true })
        }

        const [handler, inputs] = routes[body.method] as unknown as [Handler, z.ZodTypeAny]
        const validationResult = validateInputs(body.data, inputs)
        if (validationResult) {
          return Response.json({ error: true, validation: validationResult })
        }

        let error: string | boolean = false
        const data = await executeHandler(handler, body, (message: string) => {
          error = message
        })

        return Response.json({ error, data })
      },
      {
        body: t.Object({
          method: t.String(),
          data: t.Any(),
          context: t.Any(),
        }),
      },
    )

    return app
  }
}
