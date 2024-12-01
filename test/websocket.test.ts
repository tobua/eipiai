import { expect, test } from 'bun:test'
import { api, route, socket, socketClient, z } from '../index'
import { startWebsocketServer } from './server'

const routes = api({
  listPosts: route()(() => [1, 2, 3]),
  getPost: route(z.number())((_, id) => [id]),
  // @ts-ignore
  subscribePosts: socket()((callback: (data: any) => void) => {
    callback([])
  }),
})

const url = startWebsocketServer(routes, 3001) // Cannot use same port as other suite.

test('Initializes client and returns regular data.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url })
  expect(await client.listPosts()).toEqual({ error: false, data: [1, 2, 3] })
  expect(await client.getPost(3)).toEqual({ error: false, data: [3] })

  close()
})
