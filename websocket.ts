import type Elysia from 'elysia'
import { t } from 'elysia'
import type { z } from 'zod'
import { executeHandler, validateInputs } from './server'
import type { Body, Handler, Methods } from './types'

async function runRoute(body: Body, routes: Methods, ws: any) {
  const [handler, inputs, subscribe] = routes[body.method] as unknown as [Handler, z.ZodTypeAny, boolean]

  if (inputs && body.data) {
    const validationResult = validateInputs(body.data, inputs)

    if (validationResult) {
      return ws.send({ error: true, validation: validationResult, subscribe: !!subscribe, route: body.method })
    }
  } else {
    body.data = undefined
  }

  let error: string | boolean = false
  const data = await executeHandler(
    handler,
    body,
    (message: string) => {
      error = message
    },
    (...data: any) => {
      runRoute({ ...body, data }, routes, ws)
    },
  )

  ws.send({ error, data, subscribe: !!subscribe, route: body.method })
}

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
        update: t.Optional(t.Boolean()),
      }),
      query: t.Object({}),
      message(ws, message: Body) {
        if (!message.method) {
          return ws.send({ error: true })
        }
        runRoute(message, routes, ws)
      },
    })

    return app
  }
}
