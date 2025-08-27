import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Toaster } from "sonner";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useSession } from '@/lib/auth-client';
import { useEffect } from 'react';


function RootComponent() {
  // const { data, isLoading } = useSession();
  // console.log("data", data);
  // console.log("data--load", isLoading);
  const res = useSession();
  console.log("res", res);

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

          <Link to="/signin" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
            <button className='px-4! py-[4px]!'>Sign in</button>
          </Link>
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