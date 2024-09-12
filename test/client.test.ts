import { expect, test } from 'bun:test'
import { api, client } from '../index'
import { startServer } from './server'

const specification = {
  listPosts: () => [1, 2, 3],
  getPost: (id: number) => [id],
  updatePost: (value: number) => value,
}

startServer(specification)

const server = api(specification)

test('Initializes client and returns data.', async () => {
  const data = client<typeof server>()

  expect(typeof data.getPost).toBe('function')
  expect(await data.getPost(3)).toEqual({ error: false, data: [3] })
})
