import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SigninForm from "@/components/forms/signin-form";

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <div className="inset-0 grid grid-cols-2 items-center min-h-screen">
      <div className="bg-zinc-900 h-full"></div>
      <div className="form-container mx-auto border border-zinc-800  w-[90%] sm:w-[60%] md:w-[40%] lg:w-[50%] max-w-[36rem] px-6 py-8 rounded-xl">
        <div className="space-y-2 text-center mb-4">
          <h1 className="text-2xl font-semibold text-zinc-500 tracking-tight">Sign in</h1>
          <p className="text-sm text-gray-400">Enter your detals to log in.</p>
        </div>
        <div className="flex flex-col items-center">
          <SigninForm />
          <div className="flex gap-2 mt-6">
            <span>Don&apos;t have an account?</span>
            <span
              className="text-indigo-500 hover:text-indigo-700 cursor-pointer"
              onClick={() => navigate({ to: "/signup" })}
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
