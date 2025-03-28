import { Hono } from 'hono';
import { userRoute } from './routes/users';
import { messagesRoute } from './routes/messages';
import { wsApp, websocket } from './ws/socket';
import { authRoute } from './routes/auth';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get('/', (c) => c.text('Welcome to Chatzy API!'));

app.route('/api/auth', authRoute);
app.route('/api/users', userRoute);
app.route('/api/messages', messagesRoute);

app.route('/', wsApp);

Bun.serve({
  fetch: app.fetch,
  websocket,
  port: 3000,
});
