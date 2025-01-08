import { expect, mock, test } from 'bun:test'
import { api, route, socketClient, subscribe, z } from '../index'
import { startWebsocketServer } from './server'

const methods = {
  listPosts: route()(() => [1, 2, 3]),
  getPost: route(z.number())((_, id) => [id]),
  subscribePosts: subscribe(z.object({ text: z.string() })),
  subscribePost: subscribe(z.number()),
  subscribeMultiplePost: subscribe(z.number(), z.string()),
}

const routes = api(methods)

const { url, subscriptions } = startWebsocketServer(routes, 3001) // Cannot use same port as other suite.
const wait = async () => await new Promise((done) => setTimeout(done, 20))

test('Initializes client and returns regular data.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url })
  expect(await client.listPosts()).toEqual({ error: false, data: [1, 2, 3] })
  expect(await client.getPost(3)).toEqual({ error: false, data: [3] })

  close()
})

test('Initializes client and subscribes to various routes.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url, context: { uid: '123' } })

  expect(subscriptions).toEqual({})

  const subscribePostsMock = mock<(data: { text: string }) => void>()
  await client.subscribePosts(subscribePostsMock)

  expect(subscriptions.subscribePosts).toBeDefined()

  const data = { text: 'Newly added post.' }

  if (subscriptions.subscribePosts) {
    subscriptions.subscribePosts(data)
    await wait()
  }

  expect(subscribePostsMock).toHaveBeenCalled()
  expect(subscribePostsMock.mock.calls[0][0]).toEqual(data)

  const subscribePostMock = mock<(data: number) => void>()
  client.subscribePost(subscribePostMock) // Skipping await

  expect(subscriptions.subscribePost).not.toBeDefined()
  await wait()
  expect(subscriptions.subscribePost).toBeDefined()

  if (subscriptions.subscribePost) {
    subscriptions.subscribePost(5)
    await wait()
  }

  expect(subscribePostMock.mock.calls[0][0]).toBe(5)

  if (subscriptions.subscribePost) {
    subscriptions.subscribePost(10)
    await wait()
  }

  expect(subscribePostMock.mock.calls[1][0]).toBe(10)

  const subscribeMultiplePostMock = mock<(first: number, second: string) => void>()
  await client.subscribeMultiplePost(subscribeMultiplePostMock)

  await wait()

  if (subscriptions.subscribeMultiplePost) {
    subscriptions.subscribeMultiplePost(1, '1')
    await wait()
  }

  expect(subscribeMultiplePostMock.mock.calls[0]).toEqual([1, '1'])

  close()
})
