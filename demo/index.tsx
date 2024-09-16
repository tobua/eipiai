/// <reference types="@rsbuild/core/types" />
import { render } from 'epic-jsx'
import { plugin, state } from 'epic-state'
import { connect } from 'epic-state/connect'
import { client } from '../index'
import type { specification } from './server'

plugin(connect)

const data = client<typeof specification>()

console.log(data)

const store = state({
  loading: true,
  error: true,
  posts: [],
})

async function loadData() {
  const { error, data: posts } = await data.listPosts()

  store.loading = false
  store.error = error
  store.posts = posts
}

loadData()

function Posts() {
  if (store.loading || store.error) {
    return <p>Loading data...</p>
  }
  return store.posts.map((post) => <p key={post.id}>{post.text}</p>)
}

render(
  <div style={{ fontFamily: 'sans-serif', display: 'flex', gap: '10px', flexDirection: 'column' }}>
    <h1>eipiai Demo</h1>
    <Posts />
  </div>,
)
