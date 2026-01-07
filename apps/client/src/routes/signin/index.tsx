import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SigninForm from "@/components/forms/signin-form";
import { GrainGradient } from "@paper-design/shaders-react";
import { InfernoLogoSmall } from "@/icons";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const quotes = [
    "Your ideas were never linear. Why is your AI?",
    "Stop thinking in tabs. Start thinking in systems.",
    "Complex problems deserve more than a single prompt.",
    "The advantage isn’t smarter AI. It’s how you use it.",
    "Multiple models. One canvas. Zero limits.",
    "This isn’t a chat app. It’s a control surface.",
    "Where simple chats go to die.",
    "You weren’t meant to think this small.",
  ];
  const [activeQuote, setActiveQuote] = useState(quotes[0]);
  useEffect(() => {
    let n = 0;
    setInterval(() => {
      setActiveQuote(quotes[n % quotes.length]);
      n++;
    }, 2000);
  }, []);
  return (
    <div className="inset-0 grid grid-cols-1 lg:grid-cols-2 items-center min-h-screen relative">
      <div className="bg-zinc-900 h-full flex lg:block relative items-center justify-center">
        <GrainGradient
          className="w-full h-full"
          colors={["#297BE6", "#ababab", "#000000"]}
          colorBack="#000000"
          softness={0.35}
          intensity={0.61}
          noise={0.4}
          shape="corners"
          speed={0.54}
          scale={0.8}
        />
        <div className="absolute top-4 left-4 cursor-pointer" onClick={() => navigate({ to: "/" })}>
          <InfernoLogoSmall className="text-white" />
        </div>
        <div className="absolute top-1/2 left-1/4">{activeQuote}</div>
      </div>
      <div className="absolute top-4 left-4 cursor-pointer block lg:hidden" onClick={() => navigate({ to: "/" })}>
        <InfernoLogoSmall className="text-white" />
      </div>
      <div className="form-container mx-auto  w-[90%] sm:w-[60%] md:w-[60%] lg:w-full max-w-[26rem] px-6 py-8 rounded-xl">
        <div className="space-y-1 text-center mb-4">
          <h1 className="text-xl! font-semibold text-zinc-200 tracking-tight">Sign in to Inferno</h1>
          <p className="text-sm text-gray-400">Welcome back! Please sign in to continue</p>
        </div>
        <div className="flex flex-col items-center">
          <SigninForm />
          <div className="flex gap-2 mt-6">
            <span>Don&apos;t have an account?</span>
            <span
              className="font-medium text-[#297BE6] hover:text-[#6a97dc] hover:underline cursor-pointer"
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
