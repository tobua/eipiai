import { Elysia, t } from 'elysia'

// biome-ignore lint/correctness/noUndeclaredVariables: Injected by runtime.
const isLocal = typeof Bun !== 'undefined'

async function readBody(request: Request) {
  return isLocal ? request.body : await new Response(request.body).json()
}

// biome-ignore lint/suspicious/noExplicitAny: Generic method, could be improved.
export function startServer(methods: { [key: string]: (...args: any[]) => any }) {
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
    .listen(3001)

  console.log('Server running on port 3001!')
}
