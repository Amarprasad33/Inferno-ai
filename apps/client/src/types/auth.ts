export type AppUser = {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
}

export type AppSession = {
    user: AppUser | null;
    /* Extend the fields if needed */
}