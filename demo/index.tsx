/// <reference types="@rsbuild/core/types" />
import { render } from 'epic-jsx'
import { plugin, state } from 'epic-state'
import { connect } from 'epic-state/connect'
import { client, socketClient } from '../index'
import type { routes, subscriptionRoutes } from './server'

plugin(connect)

const data = client<typeof routes>({ url: 'http://localhost:3001/demo' })
const { client: socket } = await socketClient<typeof subscriptionRoutes>({ url: 'ws://localhost:3002/socket-demo' })

const store = state({
  loading: true,
  error: true,
  posts: [],
})

const socketStore = state({
  loading: true,
  error: true,
  posts: [],
  loadingTime: true,
  errorTime: false,
  time: '00:00'
})

async function loadData() {
  const { error, data: posts } = await data.listPosts()

  store.loading = false
  store.error = !!error
  store.posts = posts
}

async function loadSocketData() {
  const { error, data: posts } = await socket.listPosts()

  socketStore.loading = false
  socketStore.error = !!error
  socketStore.posts = posts


  const { error: errorTime} = await socket.subscribeTime((time: string) => { socketStore.time = time}, 'hey')

  socketStore.loadingTime = false
  socketStore.errorTime = !!errorTime
}

loadData()
loadSocketData()

const InlineCode = ({ children }) => (
  <span style={{ fontFamily: 'monospace', backgroundColor: 'gray', color: 'white', padding: 3, borderRadius: 3 }}>{children}</span>
)

function Time() {
  if (socketStore.loadingTime || socketStore.errorTime) {
    return <p>Loading...</p>
  }

  return <p>{socketStore.time}</p>
}

function Posts({ data }: { data: typeof store}) {
  if (data.loading) {
    // @ts-ignore will be fixed in epic-jsx types.
    return <p>Loading data...</p>
  }
  if (data.error) {
    return (
      <p>
        {/* @ts-ignore type issue */}
        Failed to load data. Checkout the repository and run <InlineCode>bun server.ts</InlineCode> inside the {/* @ts-ignore type issue */}
        <InlineCode>demo</InlineCode> folder.
      </p>
    )
  }
  return data.posts.map((post) => <p key={post.id}>{post.text}</p>)
}

render(
  <div style={{ fontFamily: 'sans-serif', display: 'flex', gap: '10px', flexDirection: 'column' }}>
    <h1>eipiai Demo</h1>
    <Posts data={store} />
    <h2>WebSocket Connection</h2>
    <Posts data={socketStore} />
    <Time />
  </div>,
)
