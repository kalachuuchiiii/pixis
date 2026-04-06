import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { Link } from "react-router-dom";

// ── Fade-in on scroll ──────────────────────────────────────────────────────
const FadeIn = ({
  children,
  delay = 0,
  className = "",
  ...props
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
} & ComponentProps<"div">) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          ((el.style.opacity = "1"), (el.style.transform = "none"));
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      {...props}
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ── Icons ──────────────────────────────────────────────────────────────────
const BoltIcon = ({
  size = 14,
  color = "white",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ── Shared ─────────────────────────────────────────────────────────────────
const SectionTag = ({ children }: { children: ReactNode }) => (
  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-4">
    {children}
  </p>
);

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2
    className="text-[clamp(28px,4vw,42px)] font-normal text-stone-900 leading-[1.15] mb-4"
    style={{ fontFamily: "'DM Serif Display', serif" }}
  >
    {children}
  </h2>
);

const SectionSub = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p className={`text-[15px] text-stone-500 leading-relaxed ${className}`}>
    {children}
  </p>
);

// ── Nav ────────────────────────────────────────────────────────────────────
const Nav = () => (
  <nav
    className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 h-[60px] px-8 flex items-center justify-between"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="flex items-center gap-2.5">
      <div className="w-[30px] h-[30px] rounded-[8px] bg-stone-900 flex items-center justify-center">
        <BoltIcon />
      </div>
      <span className="text-[17px] font-semibold text-stone-900 tracking-tight">
        pixis
      </span>
    </div>
    <div className="hidden md:flex items-center gap-7">
      {["Features", "Modes", "Dashboard", "Docs"].map((l) => (
        <a
          key={l}
          href={`#${l.toLowerCase()}`}
          className="text-[13.5px] text-stone-500 hover:text-stone-900 transition-colors"
        >
          {l}
        </a>
      ))}
    </div>
    <button className="h-[34px] px-[18px] rounded-[8px] bg-stone-900 text-white text-[13px] font-medium hover:opacity-80 transition-opacity">
      Get started free
    </button>
  </nav>
);

// ── Hero ───────────────────────────────────────────────────────────────────
const Hero = () => (
  <section
    className="relative overflow-hidden px-8 pt-24 pb-20 text-center"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {/* dot grid */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, #d6d3d1 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.38,
      }}
    />
    {/* blobs */}
    <div className="absolute -top-28 -left-24 w-[480px] h-[480px] rounded-full bg-amber-50 blur-[100px] opacity-60 pointer-events-none" />
    <div className="absolute -top-20 -right-20 w-[380px] h-[380px] rounded-full bg-sky-50 blur-[100px] opacity-55 pointer-events-none" />

    <div className="relative z-10 max-w-2xl mx-auto">
      <FadeIn>
        <div className="inline-flex items-center gap-2 px-[14px] py-[5px] rounded-full border border-stone-200 bg-white text-[12px] text-stone-500 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
          Free forever · No email needed
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <h1
          className="text-[clamp(42px,6vw,72px)] font-normal leading-[1.05] text-stone-900 mb-6"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          The smarter way
          <br />
          to <em className="text-stone-400">actually</em> remember.
        </h1>
      </FadeIn>

      <FadeIn delay={140}>
        <p className="text-[17px] text-stone-500 leading-relaxed max-w-[460px] mx-auto mb-10">
          Pixis uses AI to generate flashcard decks instantly. Study your way —
          from casual review to exam crunch mode — and track exactly what your
          brain needs.
        </p>
      </FadeIn>

      <FadeIn delay={190}>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to={"/sign-up"}>
            <button className="h-11 px-7 rounded-[10px] bg-stone-900 text-white text-[14px] font-medium hover:opacity-80 transition-opacity">
              Start studying free →
            </button>
          </Link>
          <button className="h-11 px-6 rounded-[10px] border border-stone-200 text-stone-500 text-[14px] hover:bg-stone-50 hover:text-stone-800 transition-colors">
            See how it works
          </button>
        </div>
        <p className="text-[12px] text-stone-400 mt-4 tracking-wide">
          No account required. Just open and go.
        </p>
      </FadeIn>
    </div>
  </section>
);

// ── Card Preview ───────────────────────────────────────────────────────────
const CardPreview = () => (
  <FadeIn className="flex justify-center px-8 pb-20">
    <div className="relative w-full max-w-[520px] h-[190px]">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[400px] h-full rounded-2xl border border-stone-200 bg-stone-50 rotate-[-4deg]" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[420px] h-full rounded-2xl border border-stone-200 bg-white rotate-[-1.5deg]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[440px] bg-white border border-stone-200 rounded-2xl p-6 shadow-sm"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-3">
          Biology · Exam mode · Card 4 of 18
        </p>
        <p className="text-[15px] font-medium text-stone-800 leading-snug mb-4">
          Explain the sodium-potassium pump and its role in maintaining resting
          membrane potential.
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Spaced · due in 2 days
          </span>
          <div className="flex gap-2">
            <button className="h-[26px] px-2.5 rounded-md text-[11px] font-medium border border-red-200 bg-red-50 text-red-700">
              Again
            </button>
            <button className="h-[26px] px-2.5 rounded-md text-[11px] font-medium border border-stone-200 bg-white text-stone-600">
              Hard
            </button>
            <button className="h-[26px] px-2.5 rounded-md text-[11px] font-medium border border-green-200 bg-green-50 text-green-700">
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  </FadeIn>
);

// ── Features ───────────────────────────────────────────────────────────────
const features = [
  {
    icon: <BoltIcon size={17} color="#92400e" />,
    bg: "bg-amber-100",
    title: "AI Deck Generation",
    desc: "Paste any text, topic, or notes and Pixis instantly builds a full deck of smart, well-structured flashcards.",
  },
  {
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0369a1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    bg: "bg-sky-100",
    title: "Share Decks",
    desc: "Share any deck with a link. Classmates can study your deck directly or clone it into their own collection.",
  },
  {
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#15803d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    bg: "bg-green-100",
    title: "Study Modes",
    desc: "Normal, exam, shuffle, and spaced repetition — each mode adapts to what your session needs.",
  },
  {
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6d28d9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    bg: "bg-violet-100",
    title: "Progress Dashboard",
    desc: "Visual breakdown of which subjects and questions you're struggling with — so you study what matters.",
  },
  {
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#be123c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    bg: "bg-rose-100",
    title: "Deck Leaderboards",
    desc: "Every shared deck has its own leaderboard. Compete with friends or classmates on the same material.",
  },
  {
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#78716c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    bg: "bg-stone-100",
    title: "Study Guides",
    desc: "Built-in docs on proven strategies — spaced repetition, active recall, the Feynman technique, and more.",
  },
];

const Features = () => (
  <section
    id="features"
    className="px-8 py-20"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="max-w-5xl mx-auto">
      <FadeIn className="text-center mb-14">
        <SectionTag>Everything you need</SectionTag>
        <SectionTitle>
          Built for real studying,
          <br />
          not just making cards.
        </SectionTitle>
        <SectionSub className="max-w-md mx-auto">
          Every feature is designed around one goal: actually getting things
          into long-term memory.
        </SectionSub>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 60}>
            <div className="border border-stone-100 rounded-2xl p-7 bg-white hover:border-stone-200 hover:shadow-sm transition-all">
              <div
                className={`w-9 h-9 rounded-[9px] ${f.bg} flex items-center justify-center mb-5`}
              >
                {f.icon}
              </div>
              <p className="text-[15px] font-semibold text-stone-900 mb-2">
                {f.title}
              </p>
              <p className="text-[13.5px] text-stone-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ── Modes ──────────────────────────────────────────────────────────────────
const modes = [
  {
    tag: "Default",
    tagClass: "bg-amber-100 text-amber-800",
    iconBg: "bg-amber-100",
    iconColor: "#92400e",
    name: "Normal",
    desc: "Flip cards at your own pace. Low-pressure review for building familiarity.",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#92400e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    tag: "Timed",
    tagClass: "bg-red-50 text-red-700",
    iconBg: "bg-red-50",
    name: "Exam Mode",
    desc: "Timed, no hints, strict scoring. Simulates the pressure of the real thing.",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#be123c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    tag: "Random",
    tagClass: "bg-sky-100 text-sky-700",
    iconBg: "bg-sky-100",
    name: "Shuffle",
    desc: "Cards appear in random order every session. Breaks pattern memorisation.",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0369a1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    tag: "Smart",
    tagClass: "bg-violet-100 text-violet-700",
    iconBg: "bg-violet-100",
    name: "Spaced Rep.",
    desc: "Cards resurface based on how well you know them. Maximises long-term retention.",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6d28d9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
];

const Modes = () => (
  <section
    id="modes"
    className="bg-stone-50 border-y border-stone-100 px-8 py-20"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <FadeIn>
        <SectionTag>Study modes</SectionTag>
        <SectionTitle>
          One deck,
          <br />
          four ways to learn.
        </SectionTitle>
        <SectionSub className="max-w-sm">
          Switch modes on any deck without losing your progress. Each mode
          serves a different phase of learning.
        </SectionSub>
      </FadeIn>
      <FadeIn delay={100}>
        <div className="grid grid-cols-2 gap-3">
          {modes.map((m) => (
            <div
              key={m.name}
              className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div
                className={`w-8 h-8 rounded-lg ${m.iconBg} flex items-center justify-center mb-3`}
              >
                {m.icon}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${m.tagClass} mb-2 inline-block`}
              >
                {m.tag}
              </span>
              <p className="text-[14px] font-semibold text-stone-900 mb-1">
                {m.name}
              </p>
              <p className="text-[12.5px] text-stone-400 leading-snug">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

// ── Gamification ───────────────────────────────────────────────────────────
const Gamification = () => (
  <section
    className="px-8 py-20"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="max-w-5xl mx-auto">
      <FadeIn className="text-center mb-14">
        <SectionTag>Stay motivated</SectionTag>
        <SectionTitle>
          Learning is more fun
          <br />
          when there's a scoreboard.
        </SectionTitle>
        <SectionSub className="max-w-md mx-auto">
          Streaks, badges, and per-deck leaderboards keep you coming back —
          without being annoying about it.
        </SectionSub>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streaks */}
        <FadeIn delay={0}>
          <div className="border border-stone-100 rounded-2xl p-7">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-1">
              Streaks
            </p>
            <div className="flex items-baseline gap-1.5 my-3">
              <span
                className="text-[48px] font-normal text-stone-900 leading-none"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                14
              </span>
              <span className="text-[14px] text-stone-400">day streak 🔥</span>
            </div>
            <p className="text-[13px] text-stone-400 mb-3">
              Study every day to keep it going.
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full bg-amber-400" />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="text-[10px] text-stone-300">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Badges */}
        <FadeIn delay={80}>
          <div className="border border-stone-100 rounded-2xl p-7">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-3">
              Badges
            </p>
            <p className="text-[13.5px] text-stone-500 leading-relaxed mb-4">
              Earn badges for milestones, streaks, and mastering decks.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "🔥 Week Warrior",
                "⚡ Speed Learner",
                "🎯 Perfect Score",
                "📚 100 Cards",
              ].map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-[12px] text-stone-700 font-medium"
                >
                  {b}
                </span>
              ))}
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-stone-200 text-[12px] text-stone-400 opacity-50">
                🏆 ???
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Leaderboard */}
        <FadeIn delay={160}>
          <div className="border border-stone-100 rounded-2xl p-7">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-3">
              Leaderboard · Bio 101
            </p>
            <p className="text-[13.5px] text-stone-500 leading-relaxed mb-4">
              Every deck has its own board. Top the class.
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { rank: "1", name: "alex_k", pts: "2,840", me: false },
                { rank: "2", name: "sarah_m", pts: "2,610", me: false },
                { rank: "3", name: "you", pts: "2,480", me: true },
                { rank: "4", name: "rjohn", pts: "1,990", me: false },
              ].map((r) => (
                <div
                  key={r.rank}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] ${r.me ? "bg-yellow-50 border border-yellow-200" : "bg-stone-50"}`}
                >
                  <span className="text-[11px] font-semibold text-stone-400 w-4 text-center">
                    {r.rank}
                  </span>
                  <span className="flex-1 font-medium text-stone-800">
                    {r.name}
                  </span>
                  <span className="text-[12px] text-stone-500">
                    {r.pts} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ── Dashboard ──────────────────────────────────────────────────────────────
const subjects = [
  { name: "Cell Biology", pct: 82, color: "bg-green-500" },
  { name: "Organic Chemistry", pct: 47, color: "bg-amber-400" },
  { name: "Macroeconomics", pct: 31, color: "bg-red-500" },
  { name: "World History", pct: 68, color: "bg-blue-500" },
];
const weak = [
  { dot: "bg-red-500", text: "Elasticity of demand vs supply" },
  { dot: "bg-amber-400", text: "SN1 vs SN2 reaction mechanisms" },
  { dot: "bg-amber-400", text: "Treaty of Westphalia significance" },
];

const Dashboard = () => (
  <section
    id="dashboard"
    className="bg-stone-50 border-y border-stone-100 px-8 py-20"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <FadeIn>
        <SectionTag>Progress dashboard</SectionTag>
        <SectionTitle>
          Know exactly
          <br />
          what to study next.
        </SectionTitle>
        <SectionSub className="max-w-sm">
          Pixis tracks every card you struggle with and surfaces the exact
          subjects and questions that need more attention — so you stop wasting
          time on what you already know.
        </SectionSub>
      </FadeIn>
      <FadeIn delay={100}>
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <div>
              <p className="text-[13px] font-semibold text-stone-900">
                My Progress
              </p>
              <p className="text-[11px] text-stone-400">
                This week · 4 active decks
              </p>
            </div>
            <span className="text-[11px] text-stone-400">7-day view</span>
          </div>
          <div className="p-5 space-y-3">
            {subjects.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="font-medium text-stone-700">{s.name}</span>
                  <span className="text-stone-400">{s.pct}%</span>
                </div>
                <div className="h-[5px] bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-stone-100 mt-2">
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-stone-400 mb-2.5">
                Needs attention
              </p>
              <div className="flex flex-col gap-1.5">
                {weak.map((w) => (
                  <div
                    key={w.text}
                    className="flex items-center gap-2 text-[12.5px] text-stone-700"
                  >
                    <div
                      className={`w-[5px] h-[5px] rounded-full ${w.dot} flex-shrink-0`}
                    />
                    {w.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);

// ── Free CTA ───────────────────────────────────────────────────────────────
const perks = [
  "Unlimited decks",
  "All study modes",
  "AI generation",
  "Deck sharing",
  "Study guides",
  "No email signup",
];

const FreeCTA = () => (
  <section
    id="docs"
    className="px-8 py-20"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <FadeIn className="max-w-5xl mx-auto">
      <div className="relative overflow-hidden bg-stone-50 border border-stone-100 rounded-3xl px-12 py-16 text-center">
        <div className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full bg-amber-50 blur-[80px] opacity-70 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-[14px] py-[5px] rounded-full border border-stone-200 bg-white text-[12px] text-stone-500 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
            Always free
          </div>
          <h2
            className="text-[clamp(32px,4vw,52px)] font-normal text-stone-900 leading-[1.1] mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Everything. Free.
            <br />
            No email required.
          </h2>
          <p className="text-[15px] text-stone-500 leading-relaxed max-w-[420px] mx-auto mb-9">
            No paywalls, no trials, no "premium" tiers. Pixis is fully free —
            open it and start studying in seconds.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {perks.map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 text-[13.5px] text-stone-700"
              >
                <div className="w-[18px] h-[18px] rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#15803d"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                </div>
                {p}
              </div>
            ))}
          </div>
          <Link to={"/sign-up"}>
            <button className="h-12 px-9 rounded-[10px] bg-stone-900 text-white text-[15px] font-medium hover:opacity-80 transition-opacity">
              Start studying free →
            </button>
          </Link>
        </div>
      </div>
    </FadeIn>
  </section>
);

// ── Offline Banner ─────────────────────────────────────────────────────────
const OfflineBanner = () => (
  <FadeIn
    className="px-8 pb-20 max-w-5xl mx-auto"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="border border-dashed border-stone-200 rounded-2xl px-8 py-6 bg-stone-50 flex items-center justify-between gap-5 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-[10px] bg-stone-100 flex items-center justify-center flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a8a29e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-stone-900 mb-0.5">
            Offline Mode
          </p>
          <p className="text-[13px] text-stone-400">
            Access your saved decks anywhere — even without internet. Your study
            never stops.
          </p>
        </div>
      </div>
      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-stone-100 text-stone-500">
        Coming soon
      </span>
    </div>
  </FadeIn>
);

// ── Footer ─────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer
    className="border-t border-stone-100 px-8 py-8 flex items-center justify-between flex-wrap gap-4"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-[7px] bg-stone-900 flex items-center justify-center">
        <BoltIcon size={12} />
      </div>
      <span className="text-[14px] font-semibold text-stone-900">pixis</span>
      <span className="text-[12px] text-stone-300">
        · Free flashcards, powered by AI
      </span>
    </div>
    <div className="flex gap-5">
      {["Features", "Study Guides", "Privacy", "GitHub"].map((l) => (
        <a
          key={l}
          href="#"
          className="text-[12.5px] text-stone-400 hover:text-stone-800 transition-colors"
        >
          {l}
        </a>
      ))}
    </div>
  </footer>
);

// ── Page ───────────────────────────────────────────────────────────────────
const LandingPage = () => (
  <div className="bg-white min-h-screen">
    <Nav />
    <Hero />
    <CardPreview />
    <Features />
    <Modes />
    <Gamification />
    <Dashboard />
    <FreeCTA />
    <OfflineBanner />
    <Footer />
  </div>
);

export default LandingPage;
