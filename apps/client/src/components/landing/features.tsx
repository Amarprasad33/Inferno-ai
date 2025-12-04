"use client";

import { ArrowUpRight, Cpu, Key, MousePointer2, ShieldCheck, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, className = "", delay = 0, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`relative group bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 rounded-none overflow-hidden flex flex-col justify-between ${className}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <ArrowUpRight className="text-zinc-500 w-5 h-5" />
      </div>

      <div className="p-8 pb-0 relative z-10">
        <div className="w-10 h-10 border border-zinc-800 bg-zinc-900/50 flex items-center justify-center mb-6 text-zinc-100 rounded-none group-hover:bg-zinc-100 group-hover:text-black transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-zinc-100 mb-3 tracking-tight">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-[90%]">{description}</p>
      </div>

      <div className="mt-6 relative w-full flex-grow overflow-hidden min-h-[160px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 h-12 bottom-0 w-full" />
        <div className="w-full h-full px-8 pb-8 flex items-end justify-center md:items-center md:justify-center">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

// --- Skeletons ---

const CanvasSkeleton = () => {
  return (
    <div className="relative w-full h-full min-h-[250px] p-4 perspective-1000">
      {/* Background Grid for the skeleton area */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />

      {/* Node 1 */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-8 w-40 border border-zinc-700 bg-black p-3 shadow-xl z-10"
      >
        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-[10px] text-zinc-400 font-mono uppercase">System</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
          <div className="h-1.5 w-3/4 bg-zinc-800 rounded-full" />
        </div>
      </motion.div>

      {/* Node 2 */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-24 left-1/2 w-44 border border-zinc-700 bg-black p-3 shadow-xl z-20"
      >
        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-[10px] text-zinc-400 font-mono uppercase">User Input</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
          <div className="h-1.5 w-5/6 bg-zinc-800 rounded-full" />
        </div>
      </motion.div>

      {/* Node 3 */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-8 right-12 w-40 border border-zinc-600 bg-zinc-900 p-3 shadow-2xl z-30"
      >
        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-[10px] text-zinc-300 font-mono uppercase">GPT-4 Output</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-zinc-700 rounded-full" />
          <div className="h-1.5 w-full bg-zinc-700 rounded-full" />
          <div className="h-1.5 w-2/3 bg-zinc-700 rounded-full" />
        </div>
      </motion.div>

      {/* Connecting Lines (SVG) */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
        <motion.path
          d="M 120 70 C 180 70, 180 130, 240 130"
          fill="none"
          stroke="#52525b"
          strokeWidth="1"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -8] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.path d="M 330 160 C 330 200, 380 200, 420 240" fill="none" stroke="#52525b" strokeWidth="1" />
      </svg>
    </div>
  );
};

const ModelSkeleton = () => {
  const models = [
    { name: "GPT-4o", color: "bg-green-500" },
    { name: "Claude 3.5 Sonnet", color: "bg-orange-500" },
    { name: "Llama 3 70B", color: "bg-blue-500" },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % models.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[220px] flex flex-col gap-2 relative">
      {models.map((model, index) => (
        <motion.div
          key={model.name}
          className={`relative p-3 border ${
            index === activeIndex ? "border-zinc-500 bg-zinc-800" : "border-zinc-800 bg-zinc-950"
          } transition-all duration-500 flex items-center gap-3`}
        >
          <div
            className={`w-3 h-3 rounded-full ${model.color} ${index === activeIndex ? "animate-pulse" : "opacity-50"}`}
          />
          <span className={`text-xs font-mono ${index === activeIndex ? "text-white" : "text-zinc-500"}`}>
            {model.name}
          </span>

          {index === activeIndex && (
            <motion.div layoutId="active-indicator" className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

const KeySkeleton = () => {
  return (
    <div className="w-full max-w-[240px] border border-zinc-800 bg-black p-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500 font-mono">OPENAI_API_KEY</span>
        <ShieldCheck className="w-3 h-3 text-zinc-500" />
      </div>

      <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900 p-2 mb-2">
        <Key className="w-3 h-3 text-zinc-600" />
        <div className="flex gap-0.5">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-zinc-600 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="w-full h-1 bg-zinc-900 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </div>
        <span className="text-[10px] text-emerald-500 font-mono">ENCRYPTED</span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
    </div>
  );
};

const CollabSkeleton = () => {
  return (
    <div className="relative w-full h-[180px] bg-zinc-950/50 border border-zinc-800 overflow-hidden">
      {/* Abstract content lines */}
      <div className="p-4 space-y-2 opacity-30">
        <div className="w-1/2 h-2 bg-zinc-700 rounded-sm" />
        <div className="w-full h-2 bg-zinc-800 rounded-sm" />
        <div className="w-3/4 h-2 bg-zinc-800 rounded-sm" />
        <div className="w-5/6 h-2 bg-zinc-800 rounded-sm" />
      </div>

      {/* Cursor 1 */}
      <motion.div
        animate={{ x: [20, 150, 40], y: [20, 60, 100] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 z-20"
      >
        <MousePointer2 className="w-4 h-4 text-orange-500 fill-orange-500/20 transform -rotate-12" />
        <div className="ml-3 px-1.5 py-0.5 bg-orange-500 text-[10px] text-black font-bold rounded-sm whitespace-nowrap">
          Sarah
        </div>
      </motion.div>

      {/* Cursor 2 */}
      <motion.div
        animate={{ x: [200, 80, 220], y: [100, 40, 80] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-0 left-0 z-20"
      >
        <MousePointer2 className="w-4 h-4 text-blue-500 fill-blue-500/20 transform -rotate-12" />
        <div className="ml-3 px-1.5 py-0.5 bg-blue-500 text-[10px] text-white font-bold rounded-sm whitespace-nowrap">
          Alex
        </div>
      </motion.div>

      {/* Interaction ripple */}
      <motion.div
        className="absolute top-[60px] left-[150px] w-8 h-8 border border-orange-500 rounded-full"
        animate={{ scale: [0.5, 1.5], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 1.5 }}
      />
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">Engineered for Power.</h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Built for developers and researchers who need more than a linear chat interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(280px,auto)]">
          {/* Card 1: Infinite Canvas - Large (2x2) */}
          <FeatureCard
            className="md:col-span-2 md:row-span-2 min-h-[400px]"
            title="Infinite Canvas"
            description="Break free from linear threads. Drag, drop, and connect chat nodes on an infinite two-dimensional plane. Visualize complex reasoning chains."
            icon={<Zap className="w-5 h-5" />}
          >
            <CanvasSkeleton />
          </FeatureCard>

          {/* Card 2: Multi-Model (1x1) */}
          <FeatureCard
            className="md:col-span-1"
            title="Multi-Model Support"
            description="Seamlessly switch between GPT-4, Claude 3.5 Sonnet, and local LLMs within the same workspace."
            icon={<Cpu className="w-5 h-5" />}
            delay={0.1}
          >
            <ModelSkeleton />
          </FeatureCard>

          {/* Card 3: BYO Keys (1x1) */}
          <FeatureCard
            className="md:col-span-1"
            title="BYO Keys"
            description="Your keys, your privacy. Stored locally. No middleman markup."
            icon={<Key className="w-5 h-5" />}
            delay={0.2}
          >
            <KeySkeleton />
          </FeatureCard>

          {/* Card 4: Collaboration (Full Width 3x1) */}
          <FeatureCard
            className="md:col-span-3"
            title="Real-time Collaboration"
            description="Invite your team to brainstorm on the same canvas. Share workflows, prompts, and discoveries instantly with multiplayer cursors and live updates."
            icon={<Users className="w-5 h-5" />}
            delay={0.3}
          >
            <CollabSkeleton />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default Features;
