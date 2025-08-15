import SignupForm from '@/components/forms/signup-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <div className="bg-white inset-0 flex justify-center items-center min-h-screen" >
      <div className="form-container mx-auto mt-30 bg-white border border-gray-300  w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] max-w-[25rem] px-6 py-8 my-14 rounded-xl">
          <div className="space-y-2 text-center mb-4">
              <h1 className="text-2xl font-semibold text-black tracking-tight">Create Your Account.</h1>
              <p className="text-sm text-gray-400">Enter your detals to get started.</p>
          </div>
          <div className="flex flex-col items-center">
              <SignupForm />
              <div className='flex gap-2 mt-6'>
                <span>Already have an account?</span>
                <span className="text-indigo-600 hover:text-indigo-500 cursor-pointer" onClick={() => navigate({ to: '/signin' })}>Sign In</span>
              </div>
          </div>
      </div>
    </div>
  )
}
