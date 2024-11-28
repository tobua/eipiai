import { Elysia } from 'elysia'
import { eipiai } from '../elysia'
import type { Methods } from '../types'
import { websocket } from '../websocket'

export function startServer(methods: Methods, port = 3000, path = 'api') {
  new Elysia()
    .onBeforeHandle(({ request }) => {
      console.log(`${request.method} request to ${request.url}`)
    })
    .use(eipiai(methods, { path }))
    .listen(port)

  console.log(`Server running on ${new URL(path, `http://localhost:${port}`).toString()}!`)
}

export function startWebsocketServer(methods: Methods, port = 3000, path = 'api') {
  new Elysia().use(websocket(methods, { path })).listen(port)

  const url = new URL(path, `ws://localhost:${port}`).toString()
  console.log(`Websocket running on ${url}!`)
  return url
}
