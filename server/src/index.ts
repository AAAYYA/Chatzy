import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { AuthRoute, authRoute } from './modules/auth/auth.service';
import { userRoute } from './routes/users';
import { messagesRoute } from './routes/messages';
import { conversationRoute } from './modules/conversations/conversations.service';
import { friendRoute } from './routes/friends';

import { wsApp, websocket } from './ws/wsServer';
import type { IServer } from '../core/IServer';

const app = new Hono().basePath('/api');

console.time("Server boot time");
console.timeLog("Server boot time", "Starting server...");

const services: Array<IServer> = [
  new AuthRoute(),
]

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

console.timeLog("Server boot time", "Loading services...");

services.forEach((service) => {
	app.route(service.route, service.routeHandler());
	if (service.middlewareHandler) {
		service.middlewareHandler().forEach((middleware) => {
				app.use(service.route, middleware);
			}
		);
	}
})

console.timeEnd("Server boot time");

app.get('/', (c) => c.text('Welcome to Chatzy API!'));



app.route('/auth', authRoute);
app.route('/users', userRoute);
app.route('/messages', messagesRoute);
app.route('/conversations', conversationRoute);
app.route('/friends', friendRoute);

app.route('/', wsApp);

Bun.serve({
  fetch: app.fetch,
  websocket,
  port: 3000,
});
