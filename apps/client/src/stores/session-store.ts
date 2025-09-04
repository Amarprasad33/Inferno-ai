import { create } from "zustand";
import type { AppSession, AppUser } from "@/types/auth";
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';



type SessionState = {
    user: AppUser | null;
    isAuhenticated: boolean;
    setUser: (user: AppUser | null) => void;
    clear: () => void;
    setSession: (session: Partial<AppSession> | null) => void;
};

export const useSessionStore = create<SessionState>()(
    devtools(
        subscribeWithSelector(
            persist(
                (set) => ({
                    user: null,
                    isAuthenticated: false,
                    setUser: (user: any) =>
                        set({
                            user,
                            isAuthenticated: !!user,
                        }),
                    setSession: (session: any) =>
                        set({
                            user: session?.user ?? null,
                            isAuthenticated: !!session?.user,
                        }),
                    clear: () => set({ user: null, isAuthenticated: false }),
                }),
                {
                    name: 'inferno/session',
                    version: 1,
                    storage: createJSONStorage(() => sessionStorage),
                    // Only persist minimal, non-sensitive info
                    partialize: (state: any) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
                },
            )
        ),
        { name: 'session-storage' }
    )

)