import { Outlet } from 'react-router-dom';
import { Bolt } from 'lucide-react';
import { Pixis, PixisAvatar } from '@/components/ui/PixisAvatar';

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-stone-950 overflow-hidden">
      {/* Left Sidebar - Marketing */}
      <div className="hidden lg:flex w-[52%] flex-col justify-between px-16 py-14 border-r border-stone-200 dark:border-stone-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #d6d3d1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.45,
          }}
        />

        {/* Decorative Blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-100 dark:bg-amber-950 blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-sky-100 dark:bg-sky-950 blur-3xl opacity-60 pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-4">
         <PixisAvatar size={40} />
         <Pixis size='lg'/>
        </div>

        {/* Main Content */}
        <div className="relative space-y-10">
          <div className="space-y-6">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">
              AI-powered flashcards
            </p>

            <h1
              className="text-[52px] font-bold leading-[1.08] tracking-tight text-stone-900 dark:text-white"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Learn faster.<br />
              <span className="text-stone-400 dark:text-stone-500">Forget less.</span>
            </h1>

            <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm">
              Paste a topic, upload notes, or just type — Pixis turns anything into smart flashcards in seconds.
            </p>
          </div>

          {/* Card Preview */}
          <div className="relative w-72">
            <div className="absolute top-3 left-3 w-full h-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800" />
            <div className="absolute top-1.5 left-1.5 w-full h-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900" />

            <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-400">
                  Biology • Card 3/12
                </span>
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Bolt className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
              </div>

              <p className="text-sm font-medium text-stone-800 dark:text-stone-200 leading-snug">
                What is the powerhouse of the cell?
              </p>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                <p className="text-xs text-stone-400 dark:text-stone-500">Tap to reveal answer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="relative flex flex-wrap gap-2">
          {['AI generation', 'Spaced repetition', 'Progress tracking', 'PDF import'].map((feature) => (
            <span
              key={feature}
              className="text-xs px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Right Panel - Auth / Forms */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-white flex items-center justify-center">
            <Bolt className="w-4 h-4 text-white dark:text-stone-900" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-stone-900 dark:text-white">pixis</span>
        </div>

        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;