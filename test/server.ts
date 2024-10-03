import { Elysia } from 'elysia'
import { eipiai } from '../elysia'
import type { Methods } from '../types'

export function startServer(methods: Methods, port = 3000, path = 'api') {
  new Elysia()
    .onBeforeHandle(({ request }) => {
      console.log(`${request.method} request to ${request.url}`)
    })
    .use(eipiai(methods, { path }))
    .listen(port)

  console.log(`Server running on ${new URL(path, `http://localhost:${port}`).toString()}!`)
}
