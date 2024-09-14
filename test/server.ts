import { Elysia, t } from 'elysia'
import type { Methods } from '../types'

// biome-ignore lint/correctness/noUndeclaredVariables: Injected by runtime.
const isLocal = typeof Bun !== 'undefined'

async function readBody(request: Request) {
  return isLocal ? request.body : await new Response(request.body).json()
}

export function startServer(methods: Methods) {
  new Elysia()
    .onBeforeHandle(({ request }) => {
      console.log(`${request.method} request to ${request.url}`)
    })
    .post(
      '/api',
      async function post(request: Request) {
        const body = (await readBody(request)) as { method: string; data: string | number[] }

        if (!body.method) {
          return Response.json({ error: true })
        }

        return Response.json({ error: false, data: methods[body.method](...body.data) })
      },
      {
        body: t.Object({
          method: t.String(),
          data: t.Any(),
        }),
      },
    )
    .listen(1000)

  console.log('Server running on http://localhost:1000!')
}
