import { Elysia } from 'elysia'
import { handler } from '../elysia'
import type { Methods } from '../types'

export function startServer(methods: Methods) {
  new Elysia()
    .onBeforeHandle(({ request }) => {
      console.log(`${request.method} request to ${request.url}`)
    })
    // @ts-ignore TODO inference issue
    .post('/api', handler(methods)[0], handler(methods)[1])
    .listen(3000)

  console.log('Server running on http://localhost:3000!')
}
