import { expect, test } from 'bun:test'
import { expectType } from 'ts-expect'
import { error } from '../elysia'
import { api, client, route, z } from '../index'
import { startServer } from './server'

function callGlobalContext(id: number) {
  error(`Custom error ${id}.`)
}

const methods = {
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
    if (id < 5) {
      error(`Custom error ${id} with ${uid}.`)
    }
    return 5
  }),
  routeAsyncGlobalContext: route(z.number())(async (_, id) => {
    await new Promise((done) => setTimeout(done, 10))
    if (id < 5) {
      callGlobalContext(id)
    }
    return id
  }),
  emptyReturn: route()(() => {}),
}

const routes = api(methods)

let server = startServer(routes) // Elysia

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

test('Non existing route will error gracefully.', async () => {
  const data = client<typeof routes>({ context: { uid: '123' } })
  // @ts-expect-error
  expect(await data.nonExisting()).toEqual({ error: true })
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

test('Context can be asynchronous.', async () => {
  const data = client<typeof routes>({
    context: async () =>
      new Promise((done) =>
        setTimeout(
          () =>
            done({
              uid: 3,
            }),
          10,
        ),
      ),
  })

  expect(await data.sharedVariable()).toEqual({ error: false, data: 3 })
})

test('Route error handler can return custom message.', async () => {
  const data = client<typeof routes>({ context: { uid: '789' } })

  expect(await data.routeError({ id: 1 })).toEqual({ error: 'Custom error 1 with 789.', data: undefined })
  expect(await data.routeError({ id: 2 })).toEqual({ error: 'Custom error 2 with 789.', data: undefined })
})

test('Input types on the client are inferred properly.', async () => {
  const data = client<typeof routes>()

  // @ts-expect-error Function types
  let result = await data.getPost('3')
  expect(result.validation[0].expected).toBe('number')
  // @ts-expect-error Nested object types
  result = await data.updatePost({ content: 5 })
  expect(result.validation[0].expected).toBe('string')
  // @ts-expect-error No additional parameters
  result = await data.listPosts('hey')
  expect(result.validation[0].code).toBe('too_big')
})

test('Output types on the client are inferred properly.', async () => {
  const data = client<typeof routes>({ context: { uid: '456' } })

  expectType<number[]>((await data.listPosts()).data)
  expectType<number[]>((await data.getPost(4)).data)
  expectType<string>((await data.updatePost({ content: 'hey' })).data)
  expectType<number>((await data.multipleArguments(4, 5)).data)
  const noError = await data.routeError({ id: 9 })
  expect(noError.error).toBe(false)
  expect(noError.data).toBe(5)
  expectType<number>(noError.data)
  const withError = await data.routeError({ id: 3 })
  expect(withError.data).toBe(undefined)
  expect(withError.error).toBe('Custom error 3 with 456.')
  expectType<string | boolean>(withError.error)
  const contextNoError = await data.routeAsyncGlobalContext(9)
  expect(contextNoError.error).toBe(false)
  expect(contextNoError.data).toBe(9)
  expectType<number>(contextNoError.data)
  const contextWithError = await data.routeAsyncGlobalContext(3)
  expect(contextWithError.data).toBe(undefined)
  expect(contextWithError.error).toBe('Custom error 3.')
  expectType<string | boolean>(contextWithError.error)
})

test('URL can be customized.', async () => {
  const routes = {
    reallyCustom: route()(() => 'custom'),
  }

  await server.close()
  server = startServer(routes, 1234, 'custom/route')
  const simpleServer = api(routes)

  const data = client<typeof simpleServer>({ url: 'http://localhost:1234/custom/route' })

  expect(await data.reallyCustom()).toEqual({ error: false, data: 'custom' })
})

test('Regular page returning client status returned in browser.', async () => {
  const response = await fetch(server.url)
  const page = await response.text()

  expect(page).toEqual('eipiai running!')
})

test('Errors when the server is stopped will be handled properly.', async () => {
  await server.close()
  expect(server.running()).toBe(false)
  server = startServer(routes, 1337)

  const data = client<typeof routes>({ url: 'http://localhost:1337/api' })

  expect(await data.getPost(3)).toEqual({ error: false, data: [3] })
  await server.close()
  expect(server.running()).toBe(false)
  // Segmentation fault, when calling closed server, probably Bun/Elysia issue.
  // expect(await data.getPost(4)).toEqual({ error: true, data: undefined })
})
