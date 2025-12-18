import { createRootRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Toaster } from "sonner";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/session-store";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { signOut } from "@/lib/auth-client";
import { InfernoLogo } from "@/icons";

function RootComponent() {
  // const { data, isLoading } = useSession();
  // console.log("data", data);
  // console.log("data--load", isLoading);
  const session = useSession();
  const setSession = useSessionStore((s) => s.setSession);
  const clear = useSessionStore((s) => s.clear);
  const location = useLocation();
  const showSidebar = ["/chat"].some((p) => location.pathname.startsWith(p));
  console.log("session", session);

  useEffect(() => {
    const user = session?.data?.user;
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

  return (
    <>
      <SidebarProvider>
        <div className="min-h-screen w-full">
          <div className="app-bar p-2 flex justify-center border-b border-[#3f3f3f] bg-zinc-950 relative z-10">
            <div className="flex gap-2 justify-between items-center min-w-md max-w-[1140px] w-3/4">
              <div className="flex gap-2 items-center">
                <InfernoLogo className="w-7 h-7" />
                <div>Inferno</div>
              </div>

              <div className="flex gap-6">
                <Link to="/" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold ">
                  Home
                </Link>
                <Link to="/about" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
                  About
                </Link>
                {/* <Link to="/exp/infini" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
                  Infini
                </Link> */}
                <Link to="/chat" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
                  Chat
                </Link>
              </div>
              <div className="flex gap-1 items-center">
                {session && session?.data && (
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-500">
                    {session.data?.user.name.substring(0, 1)}
                  </div>
                )}

                {session && session?.data ? (
                  <Button variant="ghost" className="px-4 py-[4px]" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/signin" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
                    <Button variant="ghost" className="px-4 py-[4px]">
                      Sign in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

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
