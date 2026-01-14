"use client";
import { ArrowRight, Mic, Plus, Search, Terminal } from "lucide-react";
import { motion } from "motion/react";
import MorePixelBackground from "./pixel-shader";
import { useNavigate } from "@tanstack/react-router";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative pt-28 pb-20 md:pt-28 md:pb-32 px-6 overflow-hidden min-h-screen">
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

      <div className="hidden md:block absolute top-1/4 right-50 w-64 h-32 border-3 border-dashed border-zinc-900 bg-zinc-950/80 backdrop-blur p-4 z-0 rotate-3">
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

      {/* Right Column: Product Interface Mockup */}
      <motion.div
        initial={{ opacity: 0, x: 20, rotateY: -10 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative lg:block perspective-1000 max-w-4xl mx-auto mt-20"
      >
        {/* Main Interface Container */}
        <div className="relative w-full h-[500px] aspect-[4/3] bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden group">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white z-20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white z-20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white z-20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white z-20" />

          {/* Crosshairs */}
          <div className="absolute top-1/2 left-4 w-2 h-px bg-zinc-700 z-20" />
          <div className="absolute top-1/2 right-4 w-2 h-px bg-zinc-700 z-20" />
          <div className="absolute top-4 left-1/2 w-px h-2 bg-zinc-700 z-20" />
          <div className="absolute bottom-4 left-1/2 w-px h-2 bg-zinc-700 z-20" />

          {/* UI Header */}
          <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            </div>
            <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              CONNECTED
            </div>
          </div>

          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-16 border-r border-zinc-800 bg-zinc-900/50 flex flex-col items-center py-4 gap-4">
              <div className="p-2 bg-zinc-800 rounded-sm text-white">
                <Plus className="w-4 h-4" />
              </div>
              <div className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-500">
                <Search className="w-4 h-4" />
              </div>
              <div className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-500">
                <Mic className="w-4 h-4" />
              </div>
              <div className="mt-auto p-2 hover:bg-zinc-800 rounded-sm text-zinc-500">
                <Terminal className="w-4 h-4" />
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:16px_16px]">
              {/* Node 1 */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 w-48 bg-black border border-zinc-800 p-3 shadow-lg z-10"
              >
                <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
                  <span className="text-[10px] font-bold text-zinc-300">INPUT</span>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-sm mb-1" />
                <div className="h-2 w-3/4 bg-zinc-800 rounded-sm" />
              </motion.div>

              {/* Node 2 */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-32 left-32 w-56 bg-black border border-zinc-800 p-3 shadow-lg z-20"
              >
                <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
                  <span className="text-[10px] font-bold text-zinc-300">ANALYSIS (CLAUDE-3)</span>
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-zinc-800 rounded-sm" />
                  <div className="h-2 w-full bg-zinc-800 rounded-sm" />
                  <div className="h-2 w-5/6 bg-zinc-800 rounded-sm" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-44 right-48 w-56 bg-black border border-zinc-800 p-3 shadow-lg z-20"
              >
                <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
                  <span className="text-[10px] font-bold text-zinc-300">THINKING (GPT-5.2)</span>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-zinc-800 rounded-sm" />
                  <div className="h-2 w-full bg-zinc-800 rounded-sm" />
                  <div className="h-2 w-5/6 bg-zinc-800 rounded-sm" />
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 w-48 bg-black border border-zinc-800 p-3 shadow-lg z-10"
              >
                <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
                  <span className="text-[10px] font-bold text-zinc-300">RESULT V2 (GEMINI-3-PRO)</span>
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-sm mb-1" />
                <div className="h-2 w-3/4 bg-zinc-800 rounded-sm" />
              </motion.div>

              {/* Connection Line */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                <path
                  d="M 150 70 C 150 120, 200 100, 200 130"
                  stroke="#52525b"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                />
              </svg>
              <svg className="absolute top-20 right-5 pointer-events-none rotate-y-180">
                <path
                  d="M 150 70 C 150 120, 200 100, 200 130"
                  stroke="#52525b"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Abstract Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-2xl -z-10 rounded-full opacity-50" />
      </motion.div>
    </section>
  );
}
