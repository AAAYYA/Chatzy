import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { AuthRoute } from './modules/auth/auth.service';
import { UserRoute } from './modules/user/users.service';
import { MessageRoute } from './modules/messages/messages.service';
import { conversationRoute } from './modules/conversations/conversations.service';
import { FriendRoute } from './modules/friends/friends.service';

import { wsApp, websocket } from './ws/wsServer';
import type { IServer } from '../core/IServer';

const app = new Hono().basePath('/api');

console.time("Server boot time");
console.timeLog("Server boot time", "Starting server...");

const services: Array<IServer> = [
	new AuthRoute(),
	new FriendRoute(),
	new UserRoute(),
	new MessageRoute()
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
		});
	}
})

console.timeEnd("Server boot time");

app.get('/', (c) => c.text('Welcome to Chatzy API!'));


app.route('/conversations', conversationRoute);

app.route('/', wsApp);

Bun.serve({
	fetch: app.fetch,
	websocket,
	port: 3000,
});
