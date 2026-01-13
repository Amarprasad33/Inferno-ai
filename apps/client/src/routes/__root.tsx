import { createRootRoute, Link, Outlet, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { Toaster } from "sonner";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/session-store";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { signOut } from "@/lib/auth-client";
import { InfernoLogoSmall } from "@/icons";

function RootComponent() {
  // const { data, isLoading } = useSession();
  // console.log("data", data);
  // console.log("data--load", isLoading);
  const navigate = useNavigate();
  const session = useSession();
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);
  const clear = useSessionStore((s) => s.clear);
  const location = useLocation();
  const showSidebar = ["/chat"].some((p) => location.pathname.startsWith(p));
  const hideTopBar = ["/signin", "/signup", "/chat"].some((p) => location.pathname.startsWith(p));
  // console.log("session", session);

  useEffect(() => {
    const user = session?.data?.user;
    console.log("user--ROOT", user);
    if (user) {
      setSession({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });
    } else {
      clear();
    }
  }, [
    session?.data?.user,
    session?.data?.user?.id,
    session?.data?.user?.email,
    session?.data?.user?.name,
    session?.data?.user?.image,
    setSession,
    clear,
  ]);

  useEffect(() => {
    router.preloadRoute({ to: "/signin", search: { isGuestModePreview: undefined } }).catch(() => {});
    router.preloadRoute({ to: "/signup" }).catch(() => {});
  }, [router]);

  return (
    <>
      <SidebarProvider>
        <div className="min-h-screen w-full selection:bg-white selection:text-black">
          {!hideTopBar && (
            <div className="app-bar sticky top-0 px-2 py-3 flex justify-center border-b border-[#222224] bg-zinc-950 z-40">
              <div className="flex gap-2 justify-between items-center min-w-md max-w-[1140px] w-3/4">
                <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate({ to: "/" })}>
                  <span className="bg-white p-[6px] rounded-[8px]">
                    <InfernoLogoSmall className="w-6 h-6 text-black " />
                  </span>
                  <div className="font-space-grotesk font-semibold text-2xl">
                    Inferno<span className="text-[#297BE6]">AI</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/"
                    className="text-[#7b7b7b] px-3 py-1 rounded-sm hover:bg-zinc-800 font-medium [&.active]:text-white [&.active]:font-semibold "
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-[#7b7b7b] px-3 py-1 rounded-sm hover:bg-zinc-800 font-medium [&.active]:text-white [&.active]:font-semibold"
                  >
                    About
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-[#7b7b7b] px-3 py-1 rounded-sm hover:bg-zinc-800 font-medium [&.active]:text-white [&.active]:font-semibold"
                  >
                    Pricing
                  </Link>
                  {/* <Link to="/exp/infini" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-semibold">
                  Infini
                </Link> */}
                  <Link
                    to="/chat"
                    className="text-[#7b7b7b] px-3 py-1 rounded-sm hover:bg-zinc-800 font-medium [&.active]:text-white [&.active]:font-semibold"
                  >
                    Chat
                  </Link>
                </div>
                <div className="flex gap-1 items-center">
                  {session && session.data?.user?.image ? (
                    <img
                      src={session.data.user.image}
                      alt={session.data.user.name ? `${session.data.user.name}'s avatar` : "User avatar"}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    session.data?.user && (
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-500">
                        {session?.data?.user?.name?.substring(0, 1)}
                      </div>
                    )
                  )}

                  {session && session?.data ? (
                    <Button variant="ghost" className="px-4 py-[4px]" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  ) : (
                    <Link
                      to="/signin"
                      search={{ isGuestModePreview: undefined }}
                      className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold"
                    >
                      <Button variant="ghost" className="px-4 py-[4px]">
                        Sign in
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex">
            {showSidebar && <AppSidebar />}

            <SidebarInset className="flex-1">
              <Outlet />
              <Toaster />
            </SidebarInset>
          </div>
          {/* <TanStackRouterDevtools /> */}
        </div>
      </SidebarProvider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
