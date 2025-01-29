import { type Elysia, t } from 'elysia'
import type { z } from 'zod'
import { executeHandler, validateInputs } from './server'
import type { Body, Handler, Methods, ServerResponse, SubscriptionHandler } from './types'

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

// Server will only send messages to subscriptions that have been previously registered by the client.
const subscriptions: { [K in string]?: SubscriptionHandler[] } = {}

export function callSubscription(method: string, ...data: any) {
  if (subscriptions[method]) {
    for (const subscriber of subscriptions[method]) {
      subscriber(...data)
    }
  }
}

function registerSubscription(message: Body, routes: Methods, ws: any) {
  const { method, data, id } = message
  if (!subscriptions[method]) {
    subscriptions[method] = []
  }
  const handler = (...args: any[]) => {
    if (routes[method] && typeof routes[method][0] === 'function' && !routes[method][0](data)) {
      return
    }
    ws.send({ error: false, data: args, route: method, subscribe: true, id: id } as ServerResponse) // TODO is sending subscribe true.
  }
  handler.id = id
  subscriptions[method].push(handler)
}

function removeSubscription(message: Body) {
  if (subscriptions[message.method]) {
    for (const subscriber of subscriptions[message.method]) {
      if (subscriber.id === message.id) {
        subscriptions[message.method] = subscriptions[message.method]?.filter((subscriber) => subscriber.id !== message.id) || []
      }
    }
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
        unsubscribe: t.Optional(t.Boolean()),
        id: t.Number(),
      }),
      query: t.Object({}),
      message(ws, message: Body) {
        if (!(message.method && Object.hasOwn(routes, message.method))) {
          return ws.send({ error: true, id: message.id } as ServerResponse)
        }

        if (message.subscription) {
          registerSubscription(message, routes, ws)
          return ws.send({ error: false, subscribed: true, route: message.method, id: message.id } as ServerResponse)
        }

        if (message.unsubscribe) {
          removeSubscription(message)
          return ws.send({ error: false, unsubscribe: true, id: message.id } as ServerResponse)
        }

        runRoute(message, routes, ws)
      },
    })

    return app
  }

  return { inject, subscriptions }
}

export function reset() {
  for (const key in subscriptions) {
    delete subscriptions[key]
  }
}
