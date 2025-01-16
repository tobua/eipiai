import { type Elysia, t } from 'elysia'
import type { z } from 'zod'
import { executeHandler, readBody, validateInputs } from './server'
import type { Body, Handler, Methods } from './types'

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

        if (inputs && body.data) {
          const validationResult = validateInputs(body.data, inputs)
          if (validationResult) {
            return Response.json({ error: true, validation: validationResult })
          }
        } else {
          body.data = undefined
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
