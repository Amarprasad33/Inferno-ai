import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    fetch: (url: RequestInfo | URL, options?: RequestInit) =>
        fetch(url, { ...options, credentials: "include" })

})

export const { signIn, signUp, useSession, sendVerificationEmail, requestPasswordReset, resetPassword } = createAuthClient();
