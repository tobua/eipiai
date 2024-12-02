import { expect, mock, test } from 'bun:test'
import { api, route, socket, socketClient, z } from '../index'
import { startWebsocketServer } from './server'

const updateMethods: { [K in keyof typeof routes]?: (data: any) => void } = {}

const routes = api({
  listPosts: route()(() => [1, 2, 3]),
  getPost: route(z.number())((_, id) => [id]),
  subscribePosts: socket()(({ update }) => {
    updateMethods.subscribePosts = update
    return 'subscribed'
  }),
  subscribePost: socket(z.number())(({ update }, id) => {
    update(id)
    updateMethods.subscribePost = update
    return id * 2
  }),
  subscribeError: socket()(({ error }) => {
    error('Failed!')
  }),
  subscribeContext: socket()(({ context }) => {
    return context.uid
  }),
})

const url = startWebsocketServer(routes, 3001) // Cannot use same port as other suite.

test('Initializes client and returns regular data.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url })
  expect(await client.listPosts()).toEqual({ error: false, data: [1, 2, 3] })
  expect(await client.getPost(3)).toEqual({ error: false, data: [3] })

  close()
})

test('Initializes client and subscribes to various routes.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url, context: { uid: '123' } })
  expect((await client.subscribeError()).error).toEqual('Failed!')
  expect((await client.subscribeContext()).data).toEqual('123')

  const subscribePosts = await client.subscribePosts()
  expect(subscribePosts.error).toBe(false)
  expect(subscribePosts.data).toEqual('subscribed')
  const subscribeMock = mock()
  if (subscribePosts.subscribe) {
    subscribePosts.subscribe(subscribeMock)
  }
  if (updateMethods.subscribePosts) {
    // @ts-ignore NEEDS custom update types.
    updateMethods.subscribePosts()
  }
  await new Promise((done) => setTimeout(done, 10))
  expect(subscribeMock).toHaveBeenCalled()
  expect(subscribeMock.mock.calls[0][0].data).toEqual('subscribed')
  // const subscribePost = await client.subscribePost(5)
  // expect(subscribePost.error).toBe(false)
  // expect(subscribePost.data).toEqual(10)

  close()
})
