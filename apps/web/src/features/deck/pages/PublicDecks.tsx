import { BoltIcon } from "lucide-react";
import { useState } from "react";
import { mockDecks } from "../data/mockDecks";
import DeckPreviewCard from "../components/DeckCard";
import { PixisAvatar } from "@/components/ui/PixisAvatar";

// ── Types ─────────────────────────────────────────────────────────────────
interface Deck {
  id: string;
  title: string;
  topic: string;
  flashcardCount: number;
  popularity: number; // e.g. views or shares
  easeFactor: number; // average ease (1.0 - 5.0)
  createdAt: Date;
  author: string;
}

// ── Reusable Topic Options ────────────────────────────────────────────────
const TOPICS: string[] = [
  "All Topics",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "History",
  "Geography",
  "Literature",
  "Computer Science",
  "Economics",
  "Psychology",
  "Medicine",
  "Languages",
];

// ── Sort Options ──────────────────────────────────────────────────────────
type SortOption = "createdAt" | "popularity" 

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "createdAt", label: "Newest" },
  { value: "popularity", label: "Most Popular" },
];

// ── Public Decks Page ─────────────────────────────────────────────────────
const PublicDecksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav - Reusing style from landing */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 h-[60px] px-8 flex items-center justify-between">
        <PixisAvatar />
        <div className="text-sm text-stone-500">Public Decks</div>
        <a
          href="/"
          className="text-[13.5px] text-stone-500 hover:text-stone-900 transition-colors"
        >
          Back to Home
        </a>
      </nav>

      <div className=" mx-auto lg:px-8 max-w-7xl pt-10 pb-16">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-[clamp(32px,5vw,48px)] font-normal text-stone-900 leading-tight mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Explore Public Decks
          </h1>
          <p className="text-[15.5px] text-stone-500 max-w-md">
            Discover high-quality flashcards shared by the community. Study
            smarter together.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-10 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search decks by title, topic or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-xl px-5 py-3 text-[15px] placeholder:text-stone-400 focus:outline-none transition-colors"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                🔍
              </div>
            </div>

            {/* Sort By */}
            <div className="lg:w-56">
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 text-[15px]">
                <span className="text-stone-400 text-sm whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent focus:outline-none flex-1 cursor-pointer text-stone-700"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Info */}
          <div className="mt-4 text-[13px] text-stone-400 flex items-center gap-2">
            Showing decks in{" "}
            <span className="font-medium text-stone-600">
              {selectedTopic === "All Topics" ? "all topics" : selectedTopic}
            </span>
            • Sorted by{" "}
            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label.toLowerCase()}
          </div>
        </div>

        {/* Deck Display Section - Placeholder */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[17px] font-semibold text-stone-800">
              Public Decks
            </h2>
            <div className="text-[13px] text-stone-400">
              1,284 decks • 42 added this week
            </div>
          </div>

          {/* Placeholder Grid - Ready for Deck Cards */}
         

          {/* Empty State Placeholder (shown when no results) */}
          {/* You can conditionally render this later */}
          {/* <div className="text-center py-20">
            <p className="text-6xl mb-6">🤔</p>
            <p className="text-xl font-medium text-stone-700 mb-2">
              No decks found
            </p>
            <p className="text-stone-500">Try adjusting your filters</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PublicDecksPage;
