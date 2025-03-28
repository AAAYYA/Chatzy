import "dotenv/config";
import { Hono } from 'hono';
import { userRoute } from './routes/users';
import { messagesRoute } from './routes/messages';

const app = new Hono();

app.get('/', (c) => c.text('Welcome to Chatzy API!'));

app.route('/api/users', userRoute);
app.route('/api/messages', messagesRoute);

export default {
  port: 3000,
  fetch: app.fetch,
};
