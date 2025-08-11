import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { authMiddleware } from './auth';
import { auth } from './routes/auth';
import { chat } from './routes/chat';

const app = new Hono();

app.route('/auth', auth);
app.use('/chat/*', authMiddleware);
app.route('/chat', chat);

const port = Number(process.env.PORT || 3001);
serve({ fetch: app.fetch, port });
console.log(`API listening on http://localhost:${port}`);