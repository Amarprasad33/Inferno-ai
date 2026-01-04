import SignupForm from "@/components/forms/signup-form";
import { InfernoLogoSmall } from "@/icons";
import { Dithering } from "@paper-design/shaders-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/signup/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <div className="inset-0 relative flex justify-center items-center h-screen">
      <div className="absolute inset-0 h-full w-full flex justify-center items-center">
        <Dithering
          className="h-full w-full"
          // height={500}
          colorBack="#00000000"
          colorFront="#727374"
          shape="swirl"
          type="8x8"
          size={1}
          speed={1.18}
          scale={4}
        />
      </div>
      <div className="form-container mx-auto my-auto border border-zinc-800  w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%] max-w-100 px-6 py-8 rounded-xl z-40 bg-zinc-950 flex flex-col">
        <div className="cursor-pointer block mx-auto mb-2" onClick={() => navigate({ to: "/" })}>
          <InfernoLogoSmall className="text-white" />
        </div>
        <div className="space-y-1 text-center mb-4">
          <h1 className="text-xl! font-semibold text-zinc-200 tracking-tight">Create Your Account.</h1>
          <p className="text-sm text-gray-400">Please fill in the details to get started.</p>
        </div>
        <div className="flex flex-col items-center">
          <SignupForm />
          <div className="flex gap-2 mt-6">
            <span>Already have an account?</span>
            <span
              className="font-medium text-[#297BE6] hover:text-[#6a97dc] hover:underline cursor-pointer"
              onClick={() => navigate({ to: "/signin" })}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
