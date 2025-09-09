import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { authMiddleware, auth } from './auth';
// import { auth } from './routes/auth';
// import { chat } from './routes/chat';
import { keys } from './routes/keys';
import { chat } from './routes/chat';
import { cors } from "hono/cors";

const app = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null,
        session: typeof auth.$Infer.Session.session | null
    }
}>();

const allowedOrigins = [
    "http://localhost:5173",
    "https://xyz-frontend.com" // example Prod frontend
]

// *** Middlewares ***
app.use(
    '*',
    cors({
        origin: allowedOrigins,
        allowHeaders: [
            "Content-Type", "Authorization",
            "X-Requested-With" // Often needed for AJAX
        ],
        allowMethods: ["POST", "POST", "PUT", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        credentials: true,
        maxAge: 600,
    })
)
app.use('/chat/*', authMiddleware);
// auth-session middlware
app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    // console.log("session--", session);
    return next();
});



// *** ROUTES ***
app.get("/session", (c) => {
    const session = c.get('session');
    const user = c.get("user");

    if (!user) return c.body(null, 401);

    return c.json({
        session,
        user
    })
});
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.route('/api/keys', keys);
app.route('/chat', chat);


app.get('/test', async c => {
    return c.json({ success: true, message: "Test response" })
});

// app.route('/auth', auth);
// app.route('/chat', chat);

const port = Number(process.env.PORT || 3000);
serve({ fetch: app.fetch, port });
console.log(`API listening on http://localhost:${port}`);