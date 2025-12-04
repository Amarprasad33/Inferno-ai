"use client";
import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "motion/react";
import MorePixelBackground from "./pixel-shader";
import { useNavigate } from "@tanstack/react-router";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MorePixelBackground />
        {/* <MorePixelBackground /> */}
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/50 px-3 py-1 mb-8 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            v2.0 Public Beta is Live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
            The Infinite Canvas <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-zinc-200 to-zinc-600">
              for AI Orchestration.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Chat with multiple models on a limitless collaborative workspace. Bring your own keys. Orchestrate complex
            workflows visually.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold text-sm rounded-none hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group"
              onClick={() => navigate({ to: "/account/your_keys" })}
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-800 text-zinc-300 font-semibold text-sm rounded-none hover:bg-zinc-900 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              View Documentation
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative floating UI elements representing nodes */}
      <div className="hidden md:block absolute top-1/3 left-50 w-64 h-32 border-3 border-dashed border-zinc-900 bg-zinc-950/80 backdrop-blur p-4 z-0 -rotate-6">
        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs text-zinc-500 font-mono">claude-3-opus</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-3/4 bg-zinc-800" />
          <div className="h-2 w-1/2 bg-zinc-800" />
        </div>
      </div>

      <div className="hidden md:block absolute bottom-1/4 right-50 w-64 h-32 border-3 border-dashed border-zinc-900 bg-zinc-950/80 backdrop-blur p-4 z-0 rotate-3">
        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-xs text-zinc-500 font-mono">gpt-4o</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-zinc-800" />
          <div className="h-2 w-5/6 bg-zinc-800" />
          <div className="h-2 w-4/5 bg-zinc-800" />
        </div>
      </div>
    </section>
  );
}
