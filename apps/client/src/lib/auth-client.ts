// import { createAuthClient } from "better-auth/client";
import { createAuthClient } from 'better-auth/react'

const BASE_URL =
    typeof window !== 'undefined'
        ? window.location.origin
        : "http://localhost:5173";

export const authClient = createAuthClient({
    baseURL: BASE_URL,
    fetch: (url: RequestInfo | URL, options?: RequestInit) =>
        fetch(url, { ...options, credentials: "include" })

})

export const { signIn, signUp, useSession, sendVerificationEmail, requestPasswordReset, resetPassword } = authClient;
