import { expect, test } from 'bun:test'
import { api, route, socketClient } from '../index'
import { startWebsocketServer } from './server'

const routes = api({
  listPosts: route()(() => [1, 2, 3]),
  // @ts-ignore
  subscribePosts: route()((callback: (data: any) => void) => {
    callback([])
  }),
})

const url = startWebsocketServer(routes, 3001) // Cannot use same port as other suite.

test('Initializes client and returns data.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url })

  expect(await client.listPosts()).toEqual({ error: false, data: ['listPosts', []] })

  close()
})
