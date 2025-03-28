import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello from Chatzy server!')
})

export default {
  port: 3000,
  fetch: app.fetch,
}
