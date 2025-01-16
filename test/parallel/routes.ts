import { api, route, z } from '../../index'

const wait = async () => await new Promise((done) => setTimeout(done, 20))

const methods = {
  immediate: route(z.number())((_, value) => `immediate ${value}`),
  delayed: route(z.number())(async (_, value) => {
    await wait()
    return `delayed ${value}`
  }),
}

export const routes = api(methods)
