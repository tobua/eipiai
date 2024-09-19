import { expect, test } from 'bun:test'
import { api, client, route, z } from '../index'
import { startServer } from './server'

const specification = {
  listPosts: route()(() => [1, 2, 3]),
  getPost: route(z.number())((id: number) => [id]),
  updatePost: route(z.object({ content: z.string() }))(({ content }) => content),
}

startServer(specification)

const server = api(specification)

test('Initializes client and returns data.', async () => {
  const data = client<typeof server>()

  expect(typeof data.getPost).toBe('function')
  expect(await data.getPost(3)).toEqual({ error: false, data: [3] })
  // @ts-expect-error
  expect(await data.getPost(3, 'missing parameter')).toEqual({ error: false, data: [3] })
  // @ts-expect-error
  const updateResult = await data.updatePost({ content: 4 })
  expect(updateResult.error).toBe(true)
  expect(updateResult.validation?.[0].expected).toBe('string')
  // @ts-ignore TODO fix type inference for objects
  expect(await data.updatePost({ content: '4' })).toEqual({ error: false, data: '4' })
})
