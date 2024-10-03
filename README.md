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

const data = client<typeof routes>({ url: 'http://localhost:3000/api' })

const { error, data } = await data.getPost(3)
```

On the client you'll import only the type definitions from the server. This way you'll get the most up-to-date types without anything ending up in the resulting client bundle.

```ts
import { Elysia } from 'elysia'
import { api, route, z } from 'eipiai'
import { plugin } from 'eipiai/elysia'

export const routes = api({
  getPost: route(z.number())((_, id) => { return id * 2 })
})

new Elysia().use(plugin(routes, { path: 'api'})).listen(3000)
```

On the server, in this case implemented with Bun's Elysia you define the routes with their types and the handler. The plugin will then inject the required POST endpoint on the desired path.
