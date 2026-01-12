import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SigninForm from "@/components/forms/signin-form";
import { GrainGradient } from "@paper-design/shaders-react";
import { InfernoLogoSmall } from "@/icons";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const quotes = useMemo(
    () => [
      "Your ideas were never linear. Why is your AI?",
      "Stop thinking in tabs. Start thinking in systems.",
      "Complex problems deserve more than a single prompt.",
      "The advantage isn’t smarter AI. It’s how you use it.",
      "Multiple models. One canvas. Zero limits.",
      "This isn’t a chat app. It’s a control surface.",
      "Where simple chats go to die.",
      "You weren’t meant to think this small.",
    ],
    []
  );
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [quotes]);
  return (
    <div className="inset-0 grid grid-cols-1 lg:grid-cols-2 items-center min-h-screen relative">
      <div className="bg-zinc-900 h-full hidden lg:flex relative items-center justify-center">
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
        {/* <div className="absolute font-instrument-serif-italic text-4xl">{activeQuote}</div> */}
        <div className="absolute font-instrument-serif-italic text-4xl max-w-2xl px-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuoteIndex}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="text-white"
            >
              {quotes[activeQuoteIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
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
