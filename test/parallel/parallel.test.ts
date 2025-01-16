import { afterAll, expect, test } from 'bun:test'
import { spawn } from 'node:child_process'
import { socketClient } from '../../index'
import type { routes } from './routes'

// Start server in parallel, otherwise async client/server calls will deadlock each other.
const child = spawn('bun', ['test/parallel/server.ts'], {
  stdio: 'inherit',
  detached: true,
})

afterAll(() => {
  child.kill('SIGTERM')
})

// Wait until server started.
await new Promise((done) => setTimeout(done, 50))

async function settleInOrder(promises) {
  const wrappedPromises = promises.map((promise, index) =>
    Promise.resolve(promise).then(
      (value) => ({ status: 'fulfilled', value, index, settledAt: Date.now() }),
      (reason) => ({ status: 'rejected', reason, index, settledAt: Date.now() }),
    ),
  )

  const resolved = await Promise.all(wrappedPromises)
  return resolved.sort((a, b) => a.settledAt - b.settledAt).map((item) => item.value)
}

test('Call order for parallel requests is preserved.', async () => {
  const { client, close } = await socketClient<typeof routes>({ url: 'ws://localhost:3002/api' })

  let promises = await settleInOrder([client.immediate(1), client.immediate(2), client.immediate(3)])

  expect(promises[0]).toEqual({ error: false, data: 'immediate 1' })
  expect(promises[1]).toEqual({ error: false, data: 'immediate 2' })
  expect(promises[2]).toEqual({ error: false, data: 'immediate 3' })

  promises = await settleInOrder([client.delayed(1), client.immediate(1), client.delayed(2), client.immediate(2)])

  expect(promises[0]).toEqual({ error: false, data: 'immediate 1' })
  expect(promises[1]).toEqual({ error: false, data: 'immediate 2' })
  expect(promises[2]).toEqual({ error: false, data: 'delayed 1' })
  expect(promises[3]).toEqual({ error: false, data: 'delayed 2' })

  close()
})
