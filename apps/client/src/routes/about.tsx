import { createFileRoute } from "@tanstack/react-router";
import { Target, Zap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="bg-black min-h-screen text-zinc-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Redefining the Chat Interface</h1>
        <p className="text-xl text-zinc-500 max-w-3xl">
          Inferno AI isn't just another chat bot wrapper. It's a spatial operating system for Large Language Models.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 pb-24">
        {/* Text Column */}
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="text-blue-500" /> Our Mission
            </h2>
            <p className="leading-relaxed">
              We believe that linear chat interfaces (like ChatGPT) are excellent for simple Q&A but fail for complex,
              multi-step reasoning. Real work involves branching thoughts, comparing outputs, and maintaining context
              across different domains. Inferno AI creates a <strong>collaborative canvas</strong> where these thoughts
              can live side-by-side.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="text-orange-500" /> The Multi-Node Architecture
            </h2>
            <p className="leading-relaxed mb-4">
              At the core of Inferno is the <strong>Node</strong>. Unlike a browser tab, a Node is a lightweight,
              independent chat session that lives on the canvas.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong>Independent Context:</strong> Each node maintains its own history.
              </li>
              <li>
                <strong>Model Agnostic:</strong> Node A can run GPT-4 while Node B runs Claude 3.5 Sonnet.
              </li>
              <li>
                <strong>Visual Linking:</strong> Connect outputs from one node to the input of another (coming soon).
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="text-green-500" /> Privacy First
            </h2>
            <p className="leading-relaxed">
              We don't sell your data or mark up API costs. You bring your own API keys, which are encrypted and stored
              locally on your device. Requests go directly from your browser to the model providers via our lightweight
              proxy.
            </p>
          </div>
        </div>

        {/* Visual Column - Minimal Details of Multi-Node Chat */}
        <div className="relative">
          <div className="sticky top-24">
            <div className="aspect-[4/5] rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 relative overflow-hidden backdrop-blur-sm shadow-2xl">
              <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>

              <div className="absolute top-4 right-4 text-xs font-mono text-zinc-600">CANVAS_VIEW_v2</div>

              {/* Node 1 */}
              <div className="absolute top-12 left-8 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg">
                <div className="bg-zinc-800 px-3 py-2 rounded-t-lg flex justify-between items-center border-b border-zinc-700">
                  <span className="text-xs font-bold text-white">Research (GPT-4)</span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="p-3 space-y-3">
                  <div className="bg-zinc-950 p-2 rounded text-[10px] text-zinc-400">
                    Analyze the quarterly report for anomalies.
                  </div>
                  <div className="text-[10px] text-zinc-300">Found 3 discrepancies in Q3 revenue...</div>
                </div>
              </div>

              {/* Connector */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path
                  d="M 180 200 C 180 250, 150 280, 150 320"
                  stroke="#3f3f46"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Node 2 */}
              <div className="absolute top-80 left-20 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg">
                <div className="bg-zinc-800 px-3 py-2 rounded-t-lg flex justify-between items-center border-b border-zinc-700">
                  <span className="text-xs font-bold text-white">Drafting (Claude 3)</span>
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                </div>
                <div className="p-3 space-y-3">
                  <div className="bg-zinc-950 p-2 rounded text-[10px] text-zinc-400">
                    Summarize these discrepancies into an email.
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-zinc-600 mt-4">
              *Schematic representation of the Infinite Canvas interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
