import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello from Chatzy backend'))

app.get('/ws', (c) => {
  const upgrade = c.req.raw.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() !== 'websocket') {
    return c.text('Not a websocket request', 400)
  }

  return c.websocket((ws) => {
    ws.on('message', (msg) => {
      console.log('Received:', msg)
      ws.send(`Echo: ${msg}`)
    })

    ws.on('close', () => {
      console.log('WebSocket closed')
    })
  })
})

export default app
