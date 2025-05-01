import { Hono, type MiddlewareHandler } from 'hono';
import { db } from '../../integration/orm/config';
import { userTable } from '../../integration/orm/schema/user.schema';
import { AServer } from '../../../core/AServer';
import { eq } from 'drizzle-orm';
import { logger } from 'hono/logger';


export class UserRoute extends AServer {
	constructor() {
		super("/users")
	}

	public routeHandler(): Hono {
		const userRoute = new Hono();

		this.middlewareHandler?.().forEach((middleware) => {
			userRoute.use(middleware);
		});

		userRoute.get('/', async (c) => {
			const allUsers = await db.select().from(userTable);

			return c.json({
				message: 'Liste de tous les users',
				data: allUsers,
			});
		});

		userRoute.post('/', async (c) => {
			try {
				const body = await c.req.json<{
					username: string;
					email: string;
					firstName: string;
					lastName: string;
					phone: string;
				}>();

				const { username, email, firstName, lastName, phone } = body;

				if (!username || !email || !firstName || !lastName || !phone) {
					return c.json({ error: 'Tous les champs sont requis' }, 400);
				}

				const inserted = await db.insert(userTable).values({
					username,
					email,
					firstName,
					lastName,
					phone,
				}).returning();

				return c.json({
					message: 'Utilisateur créé avec succès',
					data: inserted[0],
				});
			} catch (err: any) {
				return c.json({ error: err.message }, 500);
			}
		});


		userRoute.get('/:id', async (c) => {
			const idParam = c.req.param('id');

			const id = Number(idParam);

			const userFound = await db.select().from(userTable).where(eq(userTable.id, id));

			if (userFound.length === 0) {
				return c.json({ error: 'User not found' }, 404);
			}

			return c.json({ data: userFound[0] });
		});


		userRoute.put('/:id', async (c) => {
			try {
				const idParam = c.req.param('id');
				const id = Number(idParam);
				const body = await c.req.json<{
					username?: string;
					firstName?: string;
					lastName?: string;
					phone?: string;
					bio?: string;
				}>();

				const fieldsToUpdate: any = {};
				if (body.username) fieldsToUpdate.username = body.username;
				if (body.firstName) fieldsToUpdate.firstName = body.firstName;
				if (body.lastName) fieldsToUpdate.lastName = body.lastName;
				if (body.phone) fieldsToUpdate.phone = body.phone;
				if (body.bio !== undefined) fieldsToUpdate.bio = body.bio;

				if (Object.keys(fieldsToUpdate).length === 0) {
					return c.json({ error: 'No valid fields to update' }, 400);
				}

				const updated = await db
					.update(userTable)
					.set(fieldsToUpdate)
					.where(eq(userTable.id, id))
					.returning();

				if (updated.length === 0) {
					return c.json({ error: 'User not found' }, 404);
				}

				return c.json({
					message: 'User updated successfully',
					data: updated[0],
				});
			} catch (err: any) {
				return c.json({ error: err.message }, 500);
			}
		});

		userRoute.delete('/:id', async (c) => {
			try {
				const idParam = c.req.param('id');
				const id = Number(idParam);

				const existing = await db.select().from(userTable).where(eq(userTable.id, id));
				if (existing.length === 0) {
					return c.json({ error: 'User not found' }, 404);
				}

				await db.delete(userTable).where(eq(userTable.id, id));

				return c.json({
					message: 'User deleted successfully',
					data: existing[0],
				});
			} catch (err: any) {
				return c.json({ error: err.message }, 500);
			}
		});

		return userRoute;
	}

	public middlewareHandler(): Array<MiddlewareHandler> {
		return [logger()]
	}
}
