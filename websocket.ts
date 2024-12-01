import type Elysia from 'elysia'
import { t } from 'elysia'
import type { z } from 'zod'
import { executeHandler, validateInputs } from './server'
import type { Body, Handler, Methods } from './types'

export function websocket(routes: Methods, options?: { path?: string }) {
  if (typeof routes !== 'object') {
    console.error('"routes" passed to eipiai(routes) must be an object.')
  }

  return (eri: Elysia) => {
    const app = eri.ws(options?.path ?? 'api', {
      body: t.Object({
        method: t.String(),
        data: t.Any(),
        context: t.Any(),
      }),
      query: t.Object({}),
      async message(ws, message) {
        if (!message.method) {
          return ws.send({ error: true })
        }
        const body = message as Body
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

        ws.send({ error, data })
      },
    })

    return app
  }
}
