import { api, route, z } from '../../index'
import { startWebsocketServer } from '../server'

const wait = async () => await new Promise((done) => setTimeout(done, 20))

const methods = {
  immediate: route(z.number())((_, value) => `immediate ${value}`),
  delayed: route(z.number())(async (_, value) => {
    await wait()
    return `delayed ${value}`
  }),
  callSubscription: route(z.object({ route: z.string(), data: z.any() }))(() => {
    return subscriptions // TODO call subscription with data.
  }),
}

const routes = api(methods)

const { subscriptions } = startWebsocketServer(routes, 3002) // Cannot use same port as other suites.
