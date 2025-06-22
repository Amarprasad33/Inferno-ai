import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen w-full">
        <div className="p-2 flex gap-2 justify-center border-b border-[#3f3f3f]">
            <Link to="/" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold ">
                Home
            </Link>
            <Link to="/about" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
                About
            </Link>
            <Link to="/exp/infini" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
                Infini
            </Link>
        </div>
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </>
  ),
})