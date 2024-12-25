# eipiai

<img align="right" src="https://github.com/tobua/eipiai/raw/main/logo.png" width="30%" alt="eipiai Logo" />

The simplest way to connect a client to a server while bypassing any HTTP features designed for server-side rendering.

- 🎓 End-to-end server/client type safety with TypeScript
- 🪶 Tiny client footprint `0.2 kB` for `v0.3.1`
- 💯 Server adapters for Elysia
- 🌳 Custom variables automatically shared among routes

```ts
import { client } from 'eipiai'
import type { routes } from './server'

const server = client<typeof routes>({ url: 'http://localhost:3000/api' })

const { error, data } = await server.getPost(3)
```

On the client you'll import only the type definitions from the server. This way you'll get the most up-to-date types without anything ending up in the resulting client bundle.

```ts
import { Elysia } from 'elysia'
import { api, route, z } from 'eipiai'
import { eipiai } from 'eipiai/elysia'

export const routes = api({
  getPost: route(z.number())((_, id) => { return id * 2 })
})

new Elysia().use(eipiai(routes, { path: 'api' })).listen(3000)
```

On the server, in this case implemented with Bun's Elysia you define the routes with their types and the handler. The plugin will then inject the required POST endpoint on the desired path.

## Vercel

While not perfectly suited for Vercel Serverless functions it can still work. All routes will be handled by a single function inside the `/api` folder of your project. For this export the server as a POST variable. Regular TypeScript Serverless functions won't be able to handle a TypeScript dependency like this one unfortunately, so you'll have to bundle the file and inline all eipiai imports. To configure the route path, place the file at that location in the file system.

```ts
import { vercel } from 'eipiai/vercel'
import { routes } from './server'

export const POST = vercel(routes)
```

## Real-time Communication

A websocket connection client can be used for real-time communication with the server.

```ts
import { Elysia } from 'elysia'
import { api, route, subscribe, z } from 'eipiai'
import { eipiai } from 'eipiai/elysia'
import { socket } from 'eipiai/socket'

export const routes = api({
  // Subscribe to any changes to posts.
  subscribePosts: subscribe()
  // Subscribe to updates for a specific post.
  subscribePost: subscribe(z.object({ id: z.number() })),
  // Can be mixed with regular routes, also sent through socket.
  allPosts: route()((_) => { return [{ id: 0, text: 'Hello World' }] })
})

const { inject, subscriptions } = socket(methods, { path })
new Elysia().use(inject).listen(port)

const url = new URL(path, `ws://localhost:${port}`).toString()
console.log(`Websocket running on ${url}!`)

subscriptions.subscribePosts([{ id: 0, text: 'Hello World' }, { id: 1, text: 'Hello Again!' }])
subscriptions.subscribePost({ id: 0, text: 'Hello Again!' })
```

On the client make sure to use `socketClient` to start a websocket connection.

```ts
import { socketClient } from 'eipiai'
import type { routes } from './server'

const server = socketClient<typeof routes>({ url: 'ws://localhost:3000/api' })

await server.subscribePosts((posts) => console.log(posts))
await server.subscribePost((post) => console.log(post.id === 0), { id: 0 })

const { error, data } = await server.allPosts()
```
