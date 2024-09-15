import { cors } from '@elysiajs/cors'
import { Elysia, t } from 'elysia'
import { api } from '../index'

const methods = {
  listPosts: () => [
    { id: 0, text: 'Hello World' },
    { id: 1, text: 'This is the post content!' },
    { id: 2, text: "What's up you guys?!" },
  ],
  getPost: (id: number) => [id],
  updatePost: (value: number) => value,
}

export const specification = api(methods)

// biome-ignore lint/correctness/noUndeclaredVariables: Injected by runtime.
const isLocal = typeof Bun !== 'undefined'

async function readBody(request: Request) {
  return isLocal ? request.body : await new Response(request.body).json()
}

new Elysia()
  .onBeforeHandle(({ request }) => {
    console.log(`${request.method} request to ${request.url}`)
  })
  .use(cors())
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
  .listen(3000)

console.log('Server running on http://localhost:3000!')
