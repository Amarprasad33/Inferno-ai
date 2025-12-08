import React from "react";
import { motion } from "motion/react";
import { GitGraph, Layers, Network } from "lucide-react";

// --- Skeleton Components ---

const LinearTrapSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-3/4 mx-auto pt-6 opacity-90">
      {/* Simulated Chat Bubble 1 (Left) */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 5 }}
        className="self-start h-1.5 w-1/2 bg-zinc-600 rounded-sm"
      />
      {/* Simulated Chat Bubble 2 (Right) */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.8, repeat: Infinity, repeatDelay: 5 }}
        className="self-end h-1.5 w-2/3 bg-zinc-500 rounded-sm"
      />
      {/* Simulated Chat Bubble 3 (Left) */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1.6, repeat: Infinity, repeatDelay: 5 }}
        className="self-start h-1.5 w-3/4 bg-zinc-600 rounded-sm"
      />

      {/* "Restricted" Warning Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.6, repeat: Infinity, repeatDelay: 5 }}
        className="mt-3 h-6 w-full border border-red-500/40 bg-red-500/10 flex items-center justify-center relative overflow-hidden"
      >
        <span className="text-[9px] text-red-400 font-mono tracking-widest uppercase">Restricted</span>
        {/* Scanline effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

const ContextSwitchSkeleton = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Card */}
      <motion.div
        animate={{
          x: [0, 20, 0],
          scale: [0.9, 1, 0.9],
          zIndex: [0, 20, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-20 h-24 bg-zinc-900 border border-zinc-700 shadow-xl flex flex-col p-2 gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-zinc-800" />
        <div className="w-full h-1 bg-zinc-800" />
        <div className="w-2/3 h-1 bg-zinc-800" />
      </motion.div>

      {/* Foreground Card */}
      <motion.div
        animate={{
          x: [0, -20, 0],
          scale: [1, 0.9, 1],
          zIndex: [20, 0, 20],
          opacity: [1, 0.4, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-20 h-24 bg-zinc-800 border border-zinc-600 shadow-xl flex flex-col p-2 gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
          <Layers className="w-3 h-3 text-zinc-400" />
        </div>
        <div className="w-full h-1 bg-zinc-700" />
        <div className="w-3/4 h-1 bg-zinc-700" />
      </motion.div>
    </div>
  );
};

const SiloedKnowledgeSkeleton = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Central Hub */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-300 rounded-full z-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
      />

      {/* Satellite Node 1 */}
      <motion.div
        animate={{ x: [0, 8, 0], y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/3 w-2 h-2 bg-zinc-600 rounded-full z-10"
      />

      {/* Satellite Node 2 */}
      <motion.div
        animate={{ x: [0, -8, 0], y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-zinc-600 rounded-full z-10"
      />

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.line
          x1="50%"
          y1="50%"
          x2="33%"
          y2="33%"
          stroke="#52525b"
          strokeWidth="1"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, 16] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.line
          x1="50%"
          y1="50%"
          x2="66%"
          y2="66%"
          stroke="#52525b"
          strokeWidth="1"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Disconnected Pulse Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-red-500/20 rounded-full"
        animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
      />
    </div>
  );
};

// --- Main Component ---

const PainPointCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  visual?: React.ReactNode;
}> = ({ title, description, icon, delay, visual }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="relative p-6 bg-zinc-900/20 border border-zinc-800/60 group hover:bg-zinc-900/40 transition-colors flex flex-col h-full"
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-zinc-500 transition-colors group-hover:border-white" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-500 transition-colors group-hover:border-white" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-zinc-500 transition-colors group-hover:border-white" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-zinc-500 transition-colors group-hover:border-white" />

      <div className="mb-6 flex-grow">
        <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-100 mb-4 group-hover:border-zinc-500 transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>

      {/* Mini Visual Area */}
      <div className="w-full h-32 bg-black/50 border border-zinc-800/50 relative overflow-hidden flex items-center justify-center mt-auto">
        {visual}
      </div>
    </motion.div>
  );
};

const PainPoints: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
            Why the old way works against you.
          </h2>
          <p className="text-zinc-400 text-lg">
            Traditional interfaces weren't designed for the complexity of modern AI workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PainPointCard
            title="The Linear Trap"
            description="Chat interfaces force you into a single vertical thread. Complex reasoning requires branching, exploring alternatives, and spatial organization."
            icon={<GitGraph className="w-5 h-5" />}
            delay={0}
            visual={<LinearTrapSkeleton />}
          />

          <PainPointCard
            title="Context Switching"
            description="Copy-pasting prompts between ChatGPT, Claude, and local models fragments your workflow and breaks your flow state."
            icon={<Layers className="w-5 h-5" />}
            delay={0.1}
            visual={<ContextSwitchSkeleton />}
          />

          <PainPointCard
            title="Siloed Knowledge"
            description="Valuable insights get trapped in isolated chat logs. True intelligence emerges when you can connect outputs from different sessions visually."
            icon={<Network className="w-5 h-5" />}
            delay={0.2}
            visual={<SiloedKnowledgeSkeleton />}
          />
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
