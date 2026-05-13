import { Button } from "@/components/ui/button";
import { ContentsDisplay } from "@/components/ui/ContentsDisplay";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import {
  Check,
  WifiOff,
  Bolt,
  Eye,
  Shuffle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// ── Shared Components ─────────────────────────────────────────────────────
const SectionTag = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-normal tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mb-3">
    {children}
  </p>
);

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[clamp(28px,5vw,48px)] font-light tracking-tighter leading-tight text-zinc-900 dark:text-white">
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

// ── Hero ──────────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative overflow-hidden w-full px-6 md:px-8 pt-20 pb-24 text-center">
    <div className="relative z-10 lg:flex w-full gap-10 space-y-10 text-left">
      <div className="space-y-2 lg:space-y-6 w-full">
        <h1 className="text-3xl lg:text-7xl  font-light tracking-tighter leading-[1.05] text-zinc-900 dark:text-white">
          The smarter way
          <br />
          to actually remember.
        </h1>

        <p className="text-xs w-full wrap break-words lg:text-xl text-zinc-600 dark:text-zinc-400 ">
          AI-powered flashcards that adapt to how you learn. From quick reviews
          to exam crunch — Pixis helps you retain what matters.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row items-end justify-center gap-2 lg:gap-4">
        <Link to="/sign-up">
          <Button variant="default" className="my-btn">
            Start studying free
          </Button>
        </Link>
      </div>
    </div>
    <ContentsDisplay />
  </section>
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
    desc: "See what you're struggling with and what to review next.",
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
    desc: "Learn spaced repetition, active recall, Feynman technique, etc.",
  },
];

const Features = () => (
  <section id="features" className="px-6 md:px-8 py-20">
    <div className="max-w-6xl  mx-auto text-center mb-16">
      <SectionTag>Everything you need</SectionTag>
      <SectionTitle>
        Built for real studying,
        <br />
        not just making cards.
      </SectionTitle>
      <SectionSub className="max-w-md mx-auto">
        Designed to move knowledge into long-term memory.
      </SectionSub>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {features.map((f, i) => (
        <div
          key={f.title}
          className={clsx(
            "border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-white dark:bg-zinc-950"
          )}
        >
          <div
            className={`w-11 h-11 rounded-2xl ${f.bg} flex items-center justify-center mb-6`}
          >
            <f.icon className={`w-6 h-6 ${f.color}`} />
          </div>
          <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-[15px]">
            {f.desc}
          </p>
        </div>
      ))}
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
    desc: "Scientifically optimized review schedule. (Coming soon)",
  },
];

const Modes = () => (
  <section id="modes" className="px-6 lg:px-8 py-20">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <SectionTag>Study modes</SectionTag>
        <SectionTitle>
          One deck,
          <br />2 powerful ways to learn.
        </SectionTitle>
        <SectionSub>Switch modes anytime</SectionSub>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modes.map((m) => (
          <div
            key={m.name}
            className="bg-white w-full dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-6"
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

            <p className="font-semibold text-lg mt-4">{m.name}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA ──────────────────────────────────────────────────────────────
const perks = [
  "Unlimited decks",
  "All study modes",
  "AI generation",
  "Deck sharing",
  "Progress tracking",
  "No email required",
];

const FreeCTA = () => (
  <section className="text-center px-6 py-20">
    <div className="max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border mb-6">
        <Check className="w-4 h-4" /> Always free
      </div>
      <div className="mb-6">
        <h2 className="text-3xl  lg:text-5xl font-light ">
          Everything.
          <br />
          Free. Forever.
        </h2>

        <p className="text-zinc-500 text-xs lg:text-base ">
          No paywalls. No premium tiers.
        </p>
      </div>

      <div className="flex flex-wrap justify-center lg:text-base text-sm gap-4 mb-10">
        {perks.map((perk) => (
          <span key={perk} className="flex items-center gap-2">
            <Check className="w-4 h-4" /> {perk}
          </span>
        ))}
      </div>

      <Link to="/sign-up">
        <Button className="my-btn">Start studying now →</Button>
      </Link>
    </div>
  </section>
);

// ── Offline ───────────────────────────────────────────────────────────────
const OfflineBanner = () => (
  <div className="px-6 max-w-5xl mx-auto py-20 text-center">
    <WifiOff className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
    <p className="font-semibold text-lg">Offline Mode</p>
    <p className="text-zinc-600 lg:text-base text-sm dark:text-zinc-400">
      Study your decks anywhere — even without internet.
    </p>
    <span className="opacity-75 mt-4 lg:text-base text-xs block">
      Coming soon
    </span>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────
const LandingPage = () => (
  <div className="min-h-screen max-w-7xl mx-auto">
    <Hero />

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
