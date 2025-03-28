import { Hono } from 'hono';
import { userRoute } from './routes/users';
import { messagesRoute } from './routes/messages';
import { wsApp, websocket } from './ws/socket';
import { authRoute } from './routes/auth';

const app = new Hono();

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
