import "dotenv/config";
import { Hono } from 'hono';
import { userRoute } from './routes/users';

const app = new Hono();

app.get('/', (c) => c.text('Welcome to Chatzy API!'));

app.route('/api/users', userRoute);

export default {
  port: 3000,
  fetch: app.fetch,
};
