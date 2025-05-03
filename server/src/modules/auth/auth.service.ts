import { Hono, type MiddlewareHandler } from 'hono';
import { db } from '../../integration/orm/config';
import { userTable } from '../../integration/orm/schema/user.schema';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';
import { authMiddleware } from '../middleware/authMiddleware';
import { AServer } from '../../../core/AServer';
import { logger } from 'hono/logger';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '../utils/zod.schema';
import { UserRepository } from '../user/users.repository';


export class AuthRoute extends AServer {
	private userRepository: UserRepository;

	constructor() {
		super("/auth");
		this.userRepository = new UserRepository();
	}

	public routeHandler(): Hono {
		const authRoute = new Hono();

		this.middlewareHandler?.().forEach((middleware) => {
			authRoute.use(middleware);
		})

		authRoute.post('/login', zValidator("json", loginSchema), async (c) => {
			try {
				const { username, password } = c.req.valid("json");

				if (!username || !password) {
					return c.json({ error: 'Username et password requis' }, 400);
				}

				const user = await this.userRepository.getUserByUsername(username);
				if (!user) {
					return c.json({ error: 'Utilisateur introuvable' }, 404);
				}

				const isValid = await Bun.password.verify(password, user.password);
				if (!isValid) {
					return c.json({ error: 'Mot de passe incorrect' }, 403);
				}

				const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
				const token = await new SignJWT({ userId: user.id })
					.setProtectedHeader({ alg: 'HS256' })
					.setExpirationTime('7d')
					.sign(secret);

				return c.json({ token });
			} catch (err: any) {
				return c.json({ error: err.message }, 500);
			}
		});

		authRoute.post('/register', zValidator("json", registerSchema), async (c) => {
			try {
				const { email, password, username } = c.req.valid("json");

				if (!email || !password || !username)
					return c.json({ message: "Indentifier not valid" }); 

				const [byUsername, byEmail] = await Promise.all([
					this.userRepository.getUserByUsername(username),
					this.userRepository.getUserByEmail(email),
				]);

				if (byUsername || byEmail) {
					return c.json({ error: 'Un utilisateur existe déjà avec ces informations' }, 409);
				}

				const hashedPassword = await Bun.password.hash(password, "bcrypt");

				const user = await this.userRepository.createUser(email, hashedPassword, username);

				const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
				const token = await new SignJWT({ userId: user.id, userEmail: user.email })
					.setProtectedHeader({ alg: 'HS256' })
					.setExpirationTime('7d')
					.sign(secret);

				return c.json({
					message: 'Inscription réussie',
					token,
					user,
				});
			} catch (err: any) {
				return c.json({ error: err.message }, 500);
			}
		});

		authRoute.get('/me', authMiddleware, async (c) => {
			const userId = c.get('userId');

			const user = await this.userRepository.getUserByID(userId as string);

			if (!user) {
				return c.json({ error: 'User not found' }, 404);
			}

			const { password, ...safeUser } = user;

			return c.json({ data: safeUser });
		});

		return authRoute;
	}

	public middlewareHandler(): Array<MiddlewareHandler> {
		return [logger()];
	}
}
