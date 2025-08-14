import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen w-full">
        <div className="p-2 flex gap-2 justify-between border-b border-[#3f3f3f]">
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
            <Link to="/chat/page" className="text-[#7b7b7b] [&.active]:text-white [&.active]:font-bold">
              Chat
            </Link>
          </div>

          <div className=''>
            <button>Sign in</button>
          </div>
        </div>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </div>
    </>
  ),
})