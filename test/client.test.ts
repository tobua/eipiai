import { expect, test } from 'bun:test'
import { api, client, route, z } from '../index'
import { startServer } from './server'

const routes = api({
  listPosts: route()(() => [1, 2, 3]),
  asyncPosts: route()(async () => {
    await new Promise((done) => setTimeout(done, 200))
    return [4, 5]
  }),
  getPost: route(z.number())((_, id) => [id]),
  updatePost: route(z.object({ content: z.string() }))((_, { content }) => content),
  multipleArguments: route(z.number(), z.number())((_, first, second) => first + second),
  sharedVariable: route()(({ context: { uid } }) => {
    return uid
  }),
  routeError: route(z.object({ id: z.number() }))(({ context: { uid }, error }, { id }) => {
    error(`Custom error ${id} with ${uid}.`)
  }),
  // biome-ignore lint/suspicious/noEmptyBlockStatements: For testing purposes.
  emptyReturn: route()(() => {}),
})

startServer(routes) // Elysia

test('Initializes client and returns data.', async () => {
  const data = client<typeof routes>()

  expect(typeof data.getPost).toBe('function')
  expect(await data.getPost(3)).toEqual({ error: false, data: [3] })
  // @ts-expect-error
  const { error, validation } = await data.getPost(3, 'non-existent parameter') // TODO bug, second parameter validated as number, should be empty.
  expect(error).toBe(true)
  expect(validation?.[0].type).toBe('array')
  expect(validation?.[0].code).toBe('too_big')
  // @ts-expect-error
  const updateResult = await data.updatePost({ content: 4 })
  expect(updateResult.error).toBe(true)
  expect(updateResult.validation?.[0].expected).toBe('string')
  // @ts-ignore TODO fix type inference for objects
  expect(await data.updatePost({ content: '4' })).toEqual({ error: false, data: '4' })

  expect(await data.listPosts()).toEqual({ error: false, data: [1, 2, 3] })
  expect(await data.asyncPosts()).toEqual({ error: false, data: [4, 5] })

  expect(await data.multipleArguments(3, 4)).toEqual({ error: false, data: 7 })
})

test('Simple shared variables can be configured.', async () => {
  const data = client<typeof routes>({ context: { uid: '123' } })
  expect(await data.sharedVariable()).toEqual({ error: false, data: '123' })
})

test('Empty return will be shown as success.', async () => {
  const data = client<typeof routes>()
  expect(await data.emptyReturn()).toEqual({ error: false, data: undefined })
})

test('Custom shared variables can be configured.', async () => {
  let state = 1
  const data = client<typeof routes>({
    context: () => ({
      uid: state,
    }),
  })

  expect(await data.sharedVariable()).toEqual({ error: false, data: 1 })
  state = 2
  expect(await data.sharedVariable()).toEqual({ error: false, data: 2 })
})

test('Route error handler can return custom message.', async () => {
  const data = client<typeof routes>({ context: { uid: '789' } })

  expect(await data.routeError({ id: 1 })).toEqual({ error: 'Custom error 1 with 789.', data: undefined })
  expect(await data.routeError({ id: 2 })).toEqual({ error: 'Custom error 2 with 789.', data: undefined })
})

test('URL can be customized.', async () => {
  const routes = {
    reallyCustom: route()(() => 'custom'),
  }

  startServer(routes, 1234, 'custom/route')
  const simpleServer = api(routes)

  const data = client<typeof simpleServer>({ url: 'http://localhost:1234/custom/route' })

  expect(await data.reallyCustom()).toEqual({ error: false, data: 'custom' })
})