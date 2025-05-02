import type { MiddlewareHandler } from 'hono';
import { jwtVerify } from 'jose';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Missing Authorization header' }, 401);
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return c.json({ error: 'Invalid Authorization format' }, 401);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const { payload } = await jwtVerify(token, secret);

    c.set('userId', payload.userId);

    await next();
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 403);
  }
};
