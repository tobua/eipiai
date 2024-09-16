import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { handler } from '../elysia'
import { api, route, z } from '../index'

const methods = {
  listPosts: route()(() => [
    { id: 0, text: 'Hello World' },
    { id: 1, text: 'This is the post content!' },
    { id: 2, text: "What's up you guys?!" },
  ]),
  getPost: route(z.number())((id: number) => [id]),
  updatePost: route(z.string())((value: string) => value),
}

export const specification = api(methods)

new Elysia()
  .onBeforeHandle(({ request }) => {
    console.log(`${request.method} request to ${request.url}`)
  })
  .use(cors())
  .post('/api', handler(methods)[0], handler(methods)[1])
  .listen(3000)

console.log('Server running on http://localhost:3000!')
