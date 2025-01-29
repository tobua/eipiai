import { expect, mock, test } from 'bun:test'
import { api, route, socketClient, subscribe, z } from '../index'
import { callSubscription, reset } from '../socket'
import { startWebsocketServer } from './server'

const methods = {
  listPosts: route()(() => [1, 2, 3]),
  getPost: route(z.number())((_, id) => [id]),
  subscribePosts: subscribe(z.object({ text: z.string() }))(),
  subscribePost: subscribe(z.number())((id: number) => id % 2 === 0),
  subscribeMultiplePost: subscribe(z.tuple([z.number(), z.string()]))(),
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

  callSubscription('subscribePosts', data)
  await wait()

  expect(subscribePostsMock).toHaveBeenCalled()
  expect(subscribePostsMock.mock.calls[0][0]).toEqual(data)

  const subscribePostMock = mock<(data: number) => void>()
  client.subscribePost(subscribePostMock, 2) // Skipping await

  expect(subscriptions.subscribePost).not.toBeDefined()
  await wait()
  expect(subscriptions.subscribePost).toBeDefined()

  callSubscription('subscribePost', 5)
  await wait()

  expect(subscribePostMock.mock.calls[0][0]).toBe(5)

  callSubscription('subscribePost', 10)
  await wait()

  expect(subscribePostMock.mock.calls[1][0]).toBe(10)

  const subscribePostFilteredMock = mock<(data: number) => void>()
  await client.subscribePost(subscribePostFilteredMock, 1) // Odd number, filtered out on server.

  expect(subscriptions.subscribePost).toBeDefined()

  callSubscription('subscribePost', 5)
  callSubscription('subscribePost', 10)
  await wait()

  expect(subscribePostFilteredMock.mock.calls.length).toBe(0)

  const subscribeMultiplePostMock = mock<(data: [first: number, second: string]) => void>()
  await client.subscribeMultiplePost(subscribeMultiplePostMock)

  await wait()

  callSubscription('subscribeMultiplePost', 1, '1')
  await wait()

  expect(subscribeMultiplePostMock.mock.calls[0][0]).toEqual([1, '1'])

  close()
})

test('Can unsubscribe from previous subscription.', async () => {
  reset()
  const { client, close } = await socketClient<typeof routes>({ url, context: { uid: '123' } })

  const firstSubscribePostsMock = mock()
  const secondSubscribePostsMock = mock()
  const { unsubscribe } = await client.subscribePosts(firstSubscribePostsMock)
  await client.subscribePosts(secondSubscribePostsMock)

  callSubscription('subscribePosts', { hello: 'world' })
  await wait()

  expect(firstSubscribePostsMock).toHaveBeenCalledTimes(1)
  expect(secondSubscribePostsMock).toHaveBeenCalledTimes(1)

  await unsubscribe()

  callSubscription('subscribePosts', { hello: 'again' })
  await wait()

  expect(firstSubscribePostsMock).toHaveBeenCalledTimes(1)
  expect(secondSubscribePostsMock).toHaveBeenCalledTimes(2)

  close()
})

test('Returns error when socket connection closed.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url, context: { uid: '123' } })

  close()
  const { error } = await client.listPosts()
  expect(error).toBe(true)
})
