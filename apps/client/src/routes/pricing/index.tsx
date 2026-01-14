import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/pricing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-black min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-800 mb-6">
            <span className="text-xs font-medium text-blue-400">Early Access Period</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">Free during Public Beta</h1>
          <p className="text-zinc-400 text-lg">
            Inferno AI is currently in active testing. We're opening up the platform for free while we polish the
            infinite canvas experience and gather community feedback.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="relative rounded-2xl p-8 border bg-zinc-900 border-zinc-700 shadow-2xl shadow-zinc-900/50 flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Limited Time
            </div>

            <div className="mb-8 text-center">
              <h3 className="text-lg font-medium text-white mb-2">Public Beta Access</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <p className="text-sm text-zinc-500 mt-4">Full access to all features.</p>
            </div>

            <div className="flex-grow mb-8 border-t border-zinc-800 pt-8">
              <ul className="space-y-4">
                {[
                  "10 Canvas Nodes",
                  "Multi-Model Support (GPT-4, Claude, etc.)",
                  "Persistent Chats (Stored Securely in Database)",
                  "Bring Your Own Key (BYOK)",
                  "Priority Discord Support",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 p-0.5 rounded-full bg-green-900/50 border border-green-800">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/chat"
              className="w-full py-3 rounded-lg text-sm font-semibold text-center transition-all bg-white text-black hover:bg-zinc-200"
            >
              Start Testing Now
            </Link>

            <p className="text-xs text-center text-zinc-600 mt-4">No credit card required.</p>
          </div>
        </div>

        {/* Note Box */}
        <div className="max-w-2xl mx-auto mt-16 p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 flex gap-4 items-start">
          <AlertCircle className="w-6 h-6 text-zinc-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-medium mb-2">Why is it free?</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We are stress-testing our node architecture and gathering user feedback on the UI. In exchange for free
              access, we simply ask that you report any bugs you find and share your workflows with us.
              <br />
              <br />
              We will introduce reasonable pricing tiers for power users and teams in the coming weeks, but early
              supporters will receive special benefits.
            </p>
          </div>
        </div>

        {/* FAQ / Info Section */}
        <div className="mt-24 border-t border-zinc-900 pt-12">
          <h3 className="text-white text-xl font-bold mb-8 text-center">Common Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h4 className="text-white font-medium mb-2">Will I be charged later?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Not automatically. When paid plans launch, you&apos;ll be given the option to upgrade. We will never
                charge your card without your explicit permission.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">What happens to my data?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your canvas data is securely stored in our database and tied to your account. This allows you to access
                your projects consistently across sessions. We do not sell your data, and you remain in control of your
                content.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Is it stable enough for work?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The core canvas and chat functionality is stable. As this is still an early release, you may encounter
                occasional visual or performance issues when working with complex node structures.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">How do I give feedback?</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                There is a feedback button inside the app, or you can directly reach out to the creator via X or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
