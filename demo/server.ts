import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { eipiai } from '../elysia'
import { callSubscription, socket } from '../socket'
import { api, route, subscribe, z } from '../index'

export const routes = api({
  listPosts: route()(() => [
    { id: 0, text: 'Hello World' },
    { id: 1, text: 'This is the post content!' },
    { id: 2, text: "What's up you guys?!" },
  ]),
  getPost: route(z.number())((_, id) => [id]),
  updatePost: route(z.string())((_, value) => value),
})

export const subscriptionRoutes = api({
  listPosts: route()(() => [
    { id: 0, text: 'Hello World' },
    { id: 1, text: 'This is the post content!' },
    { id: 2, text: "What's up you guys?!" },
  ]),
  subscribeTime: subscribe(z.string())()
})

const { server } = new Elysia()
  .use(cors())
  .use(eipiai(routes, { path: 'demo' }))
  .listen(3001)

// biome-ignore lint/suspicious/noConsole: Server code.
// biome-ignore lint/suspicious/noConsoleLog: Server code.
console.log(`Server running on http://${server?.hostname}:${server?.port}/demo!`)

const { inject } = socket(subscriptionRoutes, { path: 'socket-demo' })

const { server: socketServer } = new Elysia()
  .use(cors())
  .use(inject)
  .listen(3002)

// biome-ignore lint/suspicious/noConsole: Server code.
// biome-ignore lint/suspicious/noConsoleLog: Server code.
console.log(`Server running on ws://${socketServer?.hostname}:${socketServer?.port}/socket-demo!`)

setInterval(() => {
  callSubscription('subscribeTime', new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
}, 1000)