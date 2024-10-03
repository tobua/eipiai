/// <reference types="@rsbuild/core/types" />
import { render } from 'epic-jsx'
import { plugin, state } from 'epic-state'
import { connect } from 'epic-state/connect'
import { client } from '../index'
import type { routes } from './server'

plugin(connect)

const data = client<typeof routes>({ url: 'http://localhost:3000/demo' })

const store = state({
  loading: true,
  error: true,
  posts: [],
})

async function loadData() {
  const { error, data: posts } = await data.listPosts()

  store.loading = false
  store.error = !!error
  store.posts = posts
}

loadData()

const InlineCode = ({ children }) => (
  <span style={{ fontFamily: 'monospace', backgroundColor: 'gray', color: 'white', padding: 3, borderRadius: 3 }}>{children}</span>
)

function Posts() {
  if (store.loading) {
    // @ts-ignore will be fixed in epic-jsx types.
    return <p>Loading data...</p>
  }
  if (store.error) {
    return (
      <p>
        {/* @ts-ignore type issue */}
        Failed to load data. Checkout the repository and run <InlineCode>bun server.ts</InlineCode> inside the {/* @ts-ignore type issue */}
        <InlineCode>demo</InlineCode> folder.
      </p>
    )
  }
  return store.posts.map((post) => <p key={post.id}>{post.text}</p>)
}

render(
  <div style={{ fontFamily: 'sans-serif', display: 'flex', gap: '10px', flexDirection: 'column' }}>
    <h1>eipiai Demo</h1>
    <Posts />
  </div>,
)
