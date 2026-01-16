import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("Missing env JWT_SECRET, Need jwt secret to auth to work");
}

const getBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    const url = process.env.PROD_BACKEND_URL || process.env.BACKEND_URL;
    return url;
  }
  return "http://localhost:3000";
};

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  baseURL: getBaseURL(),
  trustedOrigins: [
    "http://localhost:5173",
    // "https://xyzwq-frontend.com", //  Prod frontend
    process.env.PROD_FRONTEND_URL || "",
  ],
  redirect: {
    onNewUser: process.env.PROD_FRONTEND_URL || "http://localhost:5173",
    onSignIn: process.env.PROD_FRONTEND_URL || "http://localhost:5173",
    onSignOut: process.env.PROD_FRONTEND_URL || "http://localhost:5173",
    onError: process.env.PROD_FRONTEND_URL || "http://localhost:5173",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, request) => {
      // await sendEmail({ to: user.email, subject: "Reset your password", text: `Reset: ${url}` });
      console.log("--------- send-reset-password -------");
    },
    onPasswordReset: async ({ user }, request) => {
      console.log("--------- on-password-reset -------");
      // log or notify
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
      // optional:
      // accessType: "offline",
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      // implement email function
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  // To enable cross-subdomain cookies, simply turn on crossSubDomainCookies
  advanced: {
    // uncomment this if you deploy both under same domain but diff. sub-domain
    // crossSubDomainCookies: {
    //   enabled: true
    // }

    // If the above config not used (separate domains or local dev)
    defaultCookieAttributes: {
      // For dev
      // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // secure: process.env.NODE_ENV === "production", // true only in prod
      // partitioned: process.env.NODE_ENV === "production",
      /* For Deploying on PROD */
      sameSite: isProd ? "none" : "Lax",
      secure: isProd,
      partitioned: isProd,
    },
    useSecureCookies: isProd,
  },
});

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function authMiddleware(c: Context, next: Next) {
  await next();
}
