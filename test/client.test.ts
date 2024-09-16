import { expect, test } from 'bun:test'
import { api, client, route, z } from '../index'
import { startServer } from './server'

const specification = {
  listPosts: route()(() => [1, 2, 3]),
  getPost: route(z.number())((id: number) => [id]),
  updatePost: route(z.string())((value: string) => value),
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
  const updateResult = await data.updatePost(4)
  expect(updateResult.error).toBe(true)
  expect(updateResult.validation?.[0].expected).toBe('string')

  expect(await data.updatePost('4')).toEqual({ error: false, data: '4' })
})
