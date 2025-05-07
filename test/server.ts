import { Elysia } from 'elysia'
import { eipiai } from '../elysia'
import { socket } from '../socket'
import type { Methods } from '../types'

export function startServer(methods: Methods, port = 3000, path = 'api') {
  const elysia = new Elysia()
    .onBeforeHandle(({ request }) => {
      console.log(`${request.method} request to ${request.url}`)
    })
    .use(eipiai(methods, { path }))
    .listen(port)

  const url = `${elysia.server.url.toString()}${path}`
  console.log(`Server running on ${url}!`)
  return { url, close: () => elysia.stop(), running: () => elysia.server?.port !== undefined }
}

export function startWebsocketServer(methods: Methods, port = 3000, path = 'api') {
  const { inject, subscriptions } = socket(methods, { path })
  const elysia = new Elysia().use(inject).listen(port)

  const url = new URL(path, `ws://localhost:${port}`).toString()
  console.log(`Websocket running on ${url}!`)
  return { url, subscriptions, close: () => elysia.stop(), running: () => elysia.server?.port !== undefined }
}
