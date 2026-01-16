import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { authMiddleware, auth } from "./auth";
// import { auth } from './routes/auth';
// import { chat } from './routes/chat';
import { keys } from "./routes/keys";
import { chat } from "./routes/chat";
import { conversations } from "./routes/conversations";
import { cors } from "hono/cors";
import { canvas } from "./routes/canvas";
import { nodes } from "./routes/node";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.PROD_FRONTEND_URL || "",
];

// *** Middlewares ***
app.use("*", async (c, next) => {
  // Render uses x-forwarded-proto to signal HTTPS
  const proto = c.req.header("x-forwarded-proto");
  if (proto === "https") {
    // This helps Better Auth realize it's on a secure domain
    c.req.raw.headers.set("x-forwarded-proto", "https");
  }
  await next();
});

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With", // Often needed for AJAX
    ],
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
  })
);
// app.use("/chat/*", authMiddleware);
// DEBUG MIDDLEWARE - Place in index.ts
app.use("*", async (c, next) => {
  console.log(`\n[${c.req.method}] ${c.req.url}`);

  // Log incoming cookies from the browser
  const cookies = c.req.header("cookie");
  console.log(">> Incoming Cookies:", cookies || "NONE");

  await next();

  // Log outgoing cookies being set by Better Auth
  const setCookie = c.res.headers.get("Set-Cookie");
  if (setCookie) {
    console.log("<< Outgoing Set-Cookie:", setCookie);
  } else {
    console.log("<< No Set-Cookie header found in response");
  }
});

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
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.route("/api/keys", keys);
app.route("/chat", chat);
app.route("/api/canvas", canvas);
app.route("/api/conversations", conversations);
app.route("/api/nodes", nodes);

app.get("/test", async (c) => {
  return c.json({ success: true, message: "Test response" });
});

const port = Number(process.env.PORT || 3000);
serve({ fetch: app.fetch, port });
console.log(`API listening on http://localhost:${port}`);
