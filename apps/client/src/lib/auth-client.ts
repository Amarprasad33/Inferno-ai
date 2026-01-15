// import { createAuthClient } from "better-auth/client";
import { createAuthClient } from "better-auth/react";
import { API_BASE } from "./keys-api";

// const BASE_URL = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

export const authClient = createAuthClient({
  baseURL: API_BASE,
  fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, { ...options, credentials: "include" }),
});

export const { signIn, signUp, signOut, useSession, sendVerificationEmail, requestPasswordReset, resetPassword } =
  authClient;
