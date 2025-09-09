import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';


const JWT_SECRET = process.env.JWT_SECRET!;
export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:5173",
    "https://xyz-frontend.com" // example Prod frontend
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, request) => {
      // await sendEmail({ to: user.email, subject: "Reset your password", text: `Reset: ${url}` });
      console.log("--------- send-reset-password -------");
    },
    onPasswordReset: async ({ user }, request) => {
      console.log("--------- on-password-reset -------");
      // e.g., log or notify
    },
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
  //   }
  // }
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      // implement email function
      console.log("---------send-verification----");
      console.log("user---", user, "url--", url);
      console.log("request--", request);
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7 // 7 days
  },
  // To enable cross-subdomain cookies, simply turn on crossSubDomainCookies
  advanced: {
    // uncomment this if you deploy both under same domain but diff. sub-domain
    // crossSubDomainCookies: {
    //   enabled: true
    // }

    // If the above config not used (separate domains or local dev)
    defaultCookieAttributes: {
      // sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
      secure: process.env.NODE_ENV === "production", // true only in prod
      partitioned: process.env.NODE_ENV === "production"
    }
  }
});


export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function authMiddleware(c: Context, next: Next) {
  //   const token = c.req.header('authorization')?.replace('Bearer ', '') 
  //     ?? c.req.cookie('auth');
  //   if (!token) return c.json({ error: 'unauthorized' }, 401);
  //   try {
  //     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  //     c.set('userId', decoded.userId);
  //     await next();
  //   } catch {
  //     return c.json({ error: 'unauthorized' }, 401);
  //   }
  await next();
}