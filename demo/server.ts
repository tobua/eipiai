import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { eipiai } from '../elysia'
import { api, route, z } from '../index'

export const routes = api({
  listPosts: route()(() => [
    { id: 0, text: 'Hello World' },
    { id: 1, text: 'This is the post content!' },
    { id: 2, text: "What's up you guys?!" },
  ]),
  getPost: route(z.number())((_, id) => [id]),
  updatePost: route(z.string())((_, value) => value),
})

new Elysia()
  .use(cors())
  .use(eipiai(routes, { path: 'demo' }))
  .listen(3001)

// biome-ignore lint/suspicious/noConsole: Server code.
// biome-ignore lint/suspicious/noConsoleLog: Server code.
console.log('Server running on http://localhost:3001/demo!')
