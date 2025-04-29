import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { authRoute } from './routes/auth';
import { userRoute } from './routes/users';
import { messagesRoute } from './routes/messages';
import { conversationRoute } from './routes/conversations';
import { friendRoute } from './routes/friends';

import { wsApp, websocket } from './ws/wsServer';

const app = new Hono();

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    if (origin.startsWith('http://localhost:')) return origin;
    return '';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.get('/', (c) => c.text('Welcome to Chatzy API!'));

app.route('/api/auth', authRoute);
app.route('/api/users', userRoute);
app.route('/api/messages', messagesRoute);
app.route('/api/conversations', conversationRoute);
app.route('/api/friends', friendRoute);

app.route('/', wsApp);

Bun.serve({
  fetch: app.fetch,
  websocket,
  port: 3000,
});
