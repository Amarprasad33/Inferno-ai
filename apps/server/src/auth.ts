import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header('authorization')?.replace('Bearer ', '') 
    ?? c.req.cookie('auth');
  if (!token) return c.json({ error: 'unauthorized' }, 401);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    c.set('userId', decoded.userId);
    await next();
  } catch {
    return c.json({ error: 'unauthorized' }, 401);
  }
}