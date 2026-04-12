
import { Outlet } from 'react-router-dom'

const Layout = () => {



  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <div className="hidden lg:flex  animate-fade-in-down w-[52%] flex-col justify-between px-16 py-14 border-r border-stone-100 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #d6d3d1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.45,
          }}
        />

        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-50 blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-sky-50 blur-3xl opacity-60 pointer-events-none" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-stone-900 font-semibold tracking-tight text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Pixis
          </span>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-5">
            <p className="text-xs font-medium tracking-[0.2em] text-stone-400 uppercase">
              AI-powered flashcards
            </p>
            <h1
              className="text-[52px] font-bold leading-[1.08] tracking-tight text-stone-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Learn faster.<br />
              <span className="text-stone-400">Forget less.</span>
            </h1>
            <p className="text-base text-stone-500 leading-relaxed max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Paste a topic, upload notes, or just type — Pixis turns anything into smart flashcards in seconds.
            </p>
          </div>
          <div className="relative w-72">
            <div className="absolute top-3 left-3 w-full h-full rounded-2xl border border-stone-200 bg-stone-50" />
            <div className="absolute top-1.5 left-1.5 w-full h-full rounded-2xl border border-stone-200 bg-white" />
            <div className="relative bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold tracking-widest text-stone-400 uppercase">Biology · Card 3/12</span>
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-stone-800 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What is the powerhouse of the cell?
              </p>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-400">Tap to reveal answer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="relative flex flex-wrap gap-2">
          {['AI generation', 'Spaced repetition', 'Progress tracking', 'PDF import'].map((f) => (
            <span
              key={f}
              className="text-xs text-stone-500 px-3 py-1.5 rounded-full border border-stone-200 bg-white"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Outlet ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-14 relative">

        {/* Mobile-only brand */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-stone-900 font-semibold tracking-tight text-base">gizmo</span>
        </div>

        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default Layout
