import { create } from "zustand";
import type { AppSession, AppUser } from "@/types/auth";
import { createJSONStorage, devtools, persist, subscribeWithSelector } from "zustand/middleware";

type SessionState = {
  user: AppUser | null;
  isAuthenticated: boolean;
  activeSessionCanvas: string | null;
  setUser: (user: AppUser | null) => void;
  clear: () => void;
  setSession: (session: Partial<AppSession> | null) => void;
  setActiveSessionCanvas: (canvasId: string | null) => void;
};

export const useSessionStore = create<SessionState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set) => ({
          user: null,
          isAuthenticated: false,
          activeSessionCanvas: null,
          setUser: (user: AppUser | null) =>
            set({
              user,
              isAuthenticated: !!user,
            }),
          setSession: (session: Partial<AppSession> | null) =>
            set({
              user: session?.user ?? null,
              isAuthenticated: !!session?.user,
            }),
          setActiveSessionCanvas: (canvasId: string | null) =>{
            set({ activeSessionCanvas: canvasId })
          },
          clear: () => {
            set({ user: null, isAuthenticated: false });
          },
        }),
        {
          name: "inferno/session",
          version: 1,
          storage: createJSONStorage(() => sessionStorage),
          // Only persist minimal, non-sensitive info
          partialize: (state: SessionState) => ({ 
            user: state.user, 
            isAuthenticated: state.isAuthenticated,
            activeSessionCanvas: state.activeSessionCanvas
          }),
        }
      )
    ),
    { name: "session-storage" }
  )
);
