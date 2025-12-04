import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-zinc-900 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-zinc-100 flex items-center justify-center rounded-none">
              <Flame className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="font-bold text-white tracking-tight">Inferno AI</span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            The infinite workspace for the next generation of AI orchestration. Designed for power users.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Changelog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Enterprise
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 justify-center flex flex-col md:flex-row items-center gap-4">
        <p className="text-zinc-600 text-xs text-center">© 2024 Inferno AI Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
