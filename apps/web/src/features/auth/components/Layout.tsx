import { Outlet } from "react-router-dom";
import { Bolt } from "lucide-react";
import { Pixis, PixisAvatar } from "@/components/ui/PixisAvatar";
import { DynamicBackground } from "@/components/ui/DynamicBackground";

const Layout = () => {
  return (
    <div className="flex h-screen w-full  overflow-hidden">
      {/* Left Sidebar - Marketing */}
      <div className="hidden lg:flex w-[52%] flex-col justify-between px-16 py-14 border-r border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        {/* Background Pattern */}

        {/* Decorative Blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-100 dark:bg-amber-950 blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-sky-100 dark:bg-sky-950 blur-3xl opacity-60 pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-4">
          <PixisAvatar size={40} />
          <Pixis size="lg" />
        </div>

        {/* Main Content */}
        <div className="relative space-y-10">
          <div className="space-y-6 tracking-tighter font-bold">
            <h1 className="text-5xl leading-[1.08] tracking-tighter text-zinc-900 dark:text-white">
              Learn faster.
              <br />
              <span className="text-zinc-400 dark:text-zinc-500">
                Forget less.
              </span>
            </h1>

            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              Paste a topic, upload notes, or just type — Pixis turns anything
              into smart flashcards in seconds.
            </p>
          </div>

          {/* Card Preview */}
          <div className="relative w-72">
            <div className="absolute top-3 left-3 w-full h-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800" />
            <div className="absolute top-1.5 left-1.5 w-full h-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" />

            <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400">
                  Biology • Card 3/12
                </span>
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Bolt className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
              </div>

              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                What is the powerhouse of the cell?
              </p>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Tap to reveal answer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="relative flex flex-wrap gap-2">
          {[
            "AI generation",
            "Progress tracking",
            "PDF import (coming soon)",
          ].map((feature) => (
            <span
              key={feature}
              className="text-xs px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Right Panel - Auth / Forms */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <PixisAvatar size={40} />
          <Pixis size="3xl" />
        </div>

        <div className="w-full max-w-sm">
          <DynamicBackground />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
