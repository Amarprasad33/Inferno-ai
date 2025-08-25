import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    baseURL: "/",
    fetch: (url: RequestInfo | URL, options?: RequestInit) =>
        fetch(url, { ...options, credentials: "include" })

})

export const { signIn, signUp, useSession, sendVerificationEmail, requestPasswordReset, resetPassword } = authClient;
