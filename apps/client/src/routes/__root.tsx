import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Toaster } from "sonner";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useSession } from '@/lib/auth-client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/session-store';


function RootComponent() {
  // const { data, isLoading } = useSession();
  // console.log("data", data);
  // console.log("data--load", isLoading);
  const session = useSession();
  const setSession = useSessionStore((s) => s.setSession);
  const clear = useSessionStore((s) => s.clear);
  console.log("session", session);

  useEffect(() => {
    const user = session?.data?.user;
    if (user) {
      setSession({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      })
    } else {
      clear();
    }
  }, [session?.data?.user, session?.data?.user?.id, session?.data?.user?.email, session?.data?.user?.name, session?.data?.user?.image, setSession, clear])

  return (
    <>
      <div className="min-h-screen w-full">
        <div className="app-bar p-2 flex gap-2 justify-between items-center border-b border-[#3f3f3f]">
          <div>Inferno</div>

          <div className='flex gap-3'>
            <Link to="/" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold ">
              Home
            </Link>
            <Link to="/about" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
              About
            </Link>
            <Link to="/exp/infini" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
              Infini
            </Link>
            <Link to="/chat" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
              Chat
            </Link>
          </div>
          <div className='flex gap-1 items-center'>
            {(session && session?.data) && <div className='w-6 h-6 flex items-center justify-center rounded-full bg-zinc-500'>
              {session.data?.user.name.substring(0, 1)}
            </div>}
            <Link to="/signin" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
              <Button variant='ghost' className='px-4 py-[4px]'>Sign in</Button>
            </Link>
          </div>
        </div>
        <Outlet />
        <Toaster />
        {/* <TanStackRouterDevtools /> */}
      </div>
    </>
  )
}


export const Route = createRootRoute({
  component: RootComponent,
})