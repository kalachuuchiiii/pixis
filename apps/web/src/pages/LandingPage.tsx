import { DynamicBackground } from "@/components/ui/DynamicBackground";
import { Pixis, PixisAvatar } from "@/components/ui/PixisAvatar";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Wifi,
  WifiOff,
  Bolt,
  Eye,
  Shuffle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Dot,
} from "lucide-react";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { Link } from "react-router-dom";

// ── Fade In on Scroll ─────────────────────────────────────────────────────
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ── Shared Components ─────────────────────────────────────────────────────
const SectionTag = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mb-3">
    {children}
  </p>
);

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[clamp(28px,5vw,48px)] font-bold tracking-tighter leading-tight text-zinc-900 dark:text-white">
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
  <p
    className={`text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed ${className}`}
  >
    {children}
  </p>
);

// ── Navigation ────────────────────────────────────────────────────────────

// ── Hero ──────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative overflow-hidden px-6 md:px-8 pt-20 pb-24 text-center">
    {/* Background Grid */}

    <div className="relative z-10 max-w-3xl mx-auto">
      <FadeIn delay={80}>
        <h1 className="text-[clamp(42px,7vw,68px)] font-bold tracking-tighter leading-[1.05] text-zinc-900 dark:text-white mb-6">
          The smarter way
          <br />
          to <span className="text-zinc-400 dark:text-zinc-500">
            actually
          </span>{" "}
          remember.
        </h1>
      </FadeIn>

      <FadeIn delay={140}>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-10">
          AI-powered flashcards that adapt to how you learn. From quick reviews
          to exam crunch — Pixis helps you retain what matters.
        </p>
      </FadeIn>

      <FadeIn delay={190}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/sign-up">
            <button className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white text-base font-medium transition-all">
              Start studying free →
            </button>
          </Link>
          <button className="w-full sm:w-auto h-12 px-8 rounded-2xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors">
            Watch 45s demo
          </button>
        </div>
      </FadeIn>
    </div>
  </section>
);

// ── Card Preview ──────────────────────────────────────────────────────────
const CardPreview = () => (
  <FadeIn className="flex justify-center px-6 pb-20">
    <div className="relative w-full max-w-md h-[220px]">
      {/* Background cards */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-80 h-40 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 rotate-[-6deg]" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-80 h-40 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rotate-[-2deg]" />

      {/* Main Card */}
      <div className="absolute left-1/2 -translate-x-1/2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-6 shadow-xl">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 mb-3">
          Biology • Exam Mode • 4/18
        </p>
        <p className="text-[15px] leading-snug font-medium text-zinc-800 dark:text-zinc-200 mb-6">
          Explain the sodium-potassium pump and its role in resting membrane
          potential.
        </p>
      </div>
    </div>
  </FadeIn>
);

// ── Features ──────────────────────────────────────────────────────────────
const features = [
  {
    icon: Bolt,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-950",
    title: "AI Deck Generation",
    desc: "Paste notes or a topic — get a smart, structured deck in seconds.",
  },
  {
    icon: Users,
    color: "text-sky-600",
    bg: "bg-sky-100 dark:bg-sky-950",
    title: "Share & Clone Decks",
    desc: "Share decks with a link. Others can study or clone them instantly.",
  },
  {
    icon: Shuffle,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-950",
    title: "Study Modes",
    desc: "Normal, or timed in one deck. (more coming soon)",
  },
  {
    icon: TrendingUp,
    color: "text-violet-600",
    bg: "bg-violet-100 dark:bg-violet-950",
    title: "Progress Dashboard",
    desc: "See exactly what you're struggling with and what to review next.",
  },
  {
    icon: Award,
    color: "text-rose-600",
    bg: "bg-rose-100 dark:bg-rose-950",
    title: "Deck Leaderboards",
    desc: "Compete with friends and classmates on shared decks.",
  },
  {
    icon: BookOpen,
    color: "text-zinc-600",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    title: "Built-in Study Guides",
    desc: "Learn proven techniques: spaced repetition, active recall, Feynman, etc.",
  },
];

const Features = () => (
  <section id="features" className="px-6 md:px-8 py-20  ">
    <div className="max-w-6xl mx-auto">
      <FadeIn className="text-center mb-16">
        <SectionTag>Everything you need</SectionTag>
        <SectionTitle>
          Built for real studying,
          <br />
          not just making cards.
        </SectionTitle>
        <SectionSub className="max-w-md mx-auto">
          Designed to move knowledge into long-term memory.
        </SectionSub>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 50}>
            <div className="group border h-full border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-sm">
              <div
                className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                {f.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed">
                {f.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ── Study Modes ───────────────────────────────────────────────────────────
const modes = [
  {
    name: "Normal",
    tag: "Default",
    color: "amber",
    icon: Eye,
    desc: "Relaxed review at your own pace.",
  },
  {
    name: "Exam Mode",
    tag: "Timed",
    color: "red",
    icon: Clock,
    desc: "Timed, high-pressure simulation.",
  },
  {
    name: "Spaced Rep.",
    tag: "Smart",
    color: "violet",
    icon: TrendingUp,
    desc: "Scientifically optimized review schedule. ( Coming soon )",
  },
];

const Modes = () => (
  <section id="modes" className="px-6 md:px-8 py-20 dark:border-zinc-800">
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <FadeIn>
        <SectionTag>Study modes</SectionTag>
        <SectionTitle>
          One deck,
          <br />2 powerful ways to learn.
        </SectionTitle>
        <SectionSub>Switch modes anytime</SectionSub>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modes.map((m) => (
            <div
              key={m.name}
              className="bg-white dark:bg-zinc-900  border border-zinc-200 dark:border-zinc-700 rounded-3xl p-6 hover:shadow transition-shadow"
            >
              <div
                className={`w-9 h-9 rounded-xl bg-${m.color}-100 dark:bg-${m.color}-950 flex items-center justify-center mb-4`}
              >
                <m.icon
                  className={`w-5 h-5 text-${m.color}-600 dark:text-${m.color}-400`}
                />
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full bg-${m.color}-100 dark:bg-${m.color}-950 text-${m.color}-700 dark:text-${m.color}-400`}
              >
                {m.tag}
              </span>
              <p className="font-semibold text-lg mt-4 mb-1 text-zinc-900 dark:text-white">
                {m.name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

// ── Free CTA ──────────────────────────────────────────────────────────────
const perks = [
  "Unlimited decks",
  "All study modes",
  "AI generation",
  "Deck sharing",
  "Progress tracking",
  "No email required",
];

const FreeCTA = () => (
  <section>
    <FadeIn>
      <div
        className="
       mx-auto  text-zinc-900 dark:text-white p-12 md:p-20 text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 bg-white/10 text-sm mb-6">
            <Check className="w-4 h-4" /> Always free
          </div>

          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight mb-6">
            Everything.
            <br />
            Free. Forever.
          </h2>

          <p className="text-xl dark:text-neutral-100 text-zinc-500 max-w-lg mx-auto mb-10">
            No paywalls. No premium tiers. Just powerful flashcards.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center mb-12 ">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 " />
                </div>
                <span>{perk}</span>
              </div>
            ))}
          </div>

          <Link to="/sign-up">
            <button className="h-14 px-10 rounded-2xl bg-white text-zinc-900 text-lg font-medium hover:bg-zinc-100 transition-colors">
              Start studying now →
            </button>
          </Link>
        </div>
      </div>
    </FadeIn>
  </section>
);

// ── Offline Banner ────────────────────────────────────────────────────────
const OfflineBanner = () => (
  <FadeIn className="px-6 max-w-5xl mx-auto py-20">
    <div className="flex flex-col items-center justify-center ">
      <div className="flex items-center gap-5">
        <WifiOff className="w-10 h-10 text-zinc-400" />
        <div>
          <p className="font-semibold text-lg text-zinc-900 dark:text-white">
            Offline Mode
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Study your decks anywhere — even without internet.
          </p>
        </div>
      </div>
      <span className="opacity-75 my-5">Coming soon</span>
    </div>
  </FadeIn>
);

// ── Footer ────────────────────────────────────────────────────────────────

// ── Main Landing Page ─────────────────────────────────────────────────────
const LandingPage = () => (
  <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
    <Hero />
    <CardPreview />
    <Separator />
    <Features />
    <Separator />
    <Modes />
    <Separator />
    <FreeCTA />
    <OfflineBanner />
  </div>
);

export default LandingPage;
