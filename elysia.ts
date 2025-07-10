import { early, earlyReturn } from 'early-return'
import { type Elysia, t } from 'elysia'
import type { z } from 'zod'
import { executeHandler, readBody, validateInputs } from './server'
import type { Body, Handler, Methods } from './types'

let errorHandler: ((message: string) => void) | undefined

export function error(message: string) {
  if (errorHandler) {
    errorHandler(message)
  }
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

        if (!(body.method && Object.hasOwn(routes, body.method))) {
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

        let errorMessage: string | boolean = false
        const callEarly = (message: string) => {
          errorMessage = message
          early(message)
        }
        errorHandler = callEarly
        const data = await earlyReturn(() => executeHandler(handler, body, callEarly))
        errorHandler = undefined

        if (errorMessage) {
          return Response.json({ error: errorMessage })
        }

        return Response.json({ error: errorMessage, data })
      },
      {
        body: t.Object({
          method: t.String(),
          data: t.Any(),
          context: t.Any(),
        }),
      },
    )

    eri.get(options?.path ?? 'api', () => new Response('eipiai running!'))

    return app
  }
}
