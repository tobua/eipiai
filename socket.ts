import { type Elysia, t } from 'elysia'
import type { z } from 'zod'
import { executeHandler, validateInputs } from './server'
import type { Body, Handler, Methods, ServerResponse } from './types'

async function runRoute(body: Body, routes: Methods, ws: any) {
  const [handler, inputs] = routes[body.method] as unknown as [Handler, z.ZodTypeAny]

  if (inputs && body.data) {
    const validationResult = validateInputs(body.data, inputs)

    if (validationResult) {
      return ws.send({ error: true, validation: validationResult, route: body.method, id: body.id } as ServerResponse)
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

  ws.send({ error, data, route: body.method, id: body.id } as ServerResponse)
}

function registerSubscription(message: Body, routes: Methods, ws: any) {
  return (...data: any[]) => {
    if (routes[message.method] && typeof routes[message.method][0] === 'function' && !routes[message.method][0](message.data)) {
      return
    }
    ws.send({ error: false, data, route: message.method, subscribe: true, id: message.id } as ServerResponse) // TODO is sending subscribe true.
  }
}

// Server will only send messages to subscriptions that have been previously registered by the client.
const subscriptions: { [K in string]?: ReturnType<typeof registerSubscription> } = {}

export function callSubscription(method: string, data: any) {
  if (subscriptions[method]) {
    subscriptions[method](data)
  }
}

export function socket(routes: Methods, options?: { path?: string }) {
  if (typeof routes !== 'object') {
    console.error('"routes" passed to eipiai(routes) must be an object.')
  }

  const inject = (eri: Elysia) => {
    const app = eri.ws(options?.path ?? 'api', {
      body: t.Object({
        method: t.String(),
        data: t.Optional(t.Any()),
        context: t.Any(),
        update: t.Optional(t.Boolean()), // TODO unused?
        subscription: t.Boolean(),
        id: t.Number(),
      }),
      query: t.Object({}),
      message(ws, message: Body) {
        if (!message.method) {
          return ws.send({ error: true, id: message.id } as ServerResponse)
        }
        if (message.subscription) {
          subscriptions[message.method] = registerSubscription(message, routes, ws)
          return ws.send({ error: false, subscribed: true, id: message.id } as ServerResponse)
        }

        runRoute(message, routes, ws)
      },
    })

    return app
  }

  return { inject, subscriptions }
}
