import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { BoltIcon } from "lucide-react";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  streak: number;
  decksStudied: number;
  accuracy: number;
  isCurrentUser?: boolean;
}

// Mock data (replace with real API data later)
const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: "alex_k", points: 12480, streak: 28, decksStudied: 47, accuracy: 94, isCurrentUser: false },
  { rank: 2, username: "sarah_m", points: 11890, streak: 19, decksStudied: 39, accuracy: 91, isCurrentUser: false },
  { rank: 3, username: "you", points: 10750, streak: 14, decksStudied: 34, accuracy: 89, isCurrentUser: true },
  { rank: 4, username: "rjohn", points: 9840, streak: 12, decksStudied: 28, accuracy: 87, isCurrentUser: false },
  { rank: 5, username: "lina_chen", points: 9230, streak: 21, decksStudied: 31, accuracy: 93, isCurrentUser: false },
  { rank: 6, username: "mike_t", points: 8740, streak: 8, decksStudied: 26, accuracy: 82, isCurrentUser: false },
  { rank: 7, username: "priya_s", points: 8120, streak: 15, decksStudied: 29, accuracy: 88, isCurrentUser: false },
  { rank: 8, username: "danny_v", points: 7650, streak: 7, decksStudied: 22, accuracy: 85, isCurrentUser: false },
];

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<"points" | "streak">("points");

  // Sort data based on active tab
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (activeTab === "points") {
      return b.points - a.points;
    } else {
      return b.streak - a.streak;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 h-[60px] px-8 flex items-center justify-between">
        <PixisAvatar />
        <div className="text-sm text-stone-500 font-medium">Global Leaderboard</div>
        <a
          href="/"
          className="text-[13.5px] text-stone-500 hover:text-stone-900 transition-colors"
        >
          ← Back to Home
        </a>
      </nav>

      <div className="lg:px-8 max-w-7xl mx-auto pt-12 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 bg-white text-[12px] text-stone-500 mb-6">
            🔥 Community Rankings
          </div>
          <h1
            className="text-[clamp(36px,5vw,52px)] font-normal text-stone-900 leading-[1.1] mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Leaderboard
          </h1>
          <p className="text-[15.5px] text-stone-500 max-w-md mx-auto">
            Top students crushing it with points and streaks
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-stone-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab("points")}
              className={`px-8 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === "points"
                  ? "bg-white shadow-sm text-stone-900"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              By Points
            </button>
            <button
              onClick={() => setActiveTab("streak")}
              className={`px-8 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === "streak"
                  ? "bg-white shadow-sm text-stone-900"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              By Streak
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden">
          <div className="px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <div className="text-[13px] font-semibold tracking-widest uppercase text-stone-400">
              RANK
            </div>
            <div className="flex-1 pl-12 text-[13px] font-semibold tracking-widest uppercase text-stone-400">
              STUDENT
            </div>
            <div className="text-right w-32 text-[13px] font-semibold tracking-widest uppercase text-stone-400">
              {activeTab === "points" ? "POINTS" : "STREAK"}
            </div>
            <div className="text-right w-28 text-[13px] font-semibold tracking-widest uppercase text-stone-400">
              DECKS
            </div>
            <div className="text-right w-20 text-[13px] font-semibold tracking-widest uppercase text-stone-400">
              ACCURACY
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {sortedData.map((entry) => (
              <div
                key={entry.rank}
                className={`px-8 py-6 flex items-center hover:bg-stone-50 transition-colors ${
                  entry.isCurrentUser ? "bg-yellow-50" : ""
                }`}
              >
                {/* Rank */}
                <div className="w-12">
                  <span
                    className={`font-semibold text-xl tabular-nums ${
                      entry.rank === 1
                        ? "text-amber-500"
                        : entry.rank === 2
                        ? "text-stone-400"
                        : entry.rank === 3
                        ? "text-amber-700"
                        : "text-stone-400"
                    }`}
                  >
                    {entry.rank}
                  </span>
                </div>

                {/* Username */}
                <div className="flex-1 pl-6 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center text-white text-sm font-medium">
                    {entry.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-[10px] font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Main Metric (Points or Streak) */}
                <div className="w-32 text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-normal text-stone-900 tabular-nums">
                      {activeTab === "points"
                        ? entry.points.toLocaleString()
                        : entry.streak}
                    </span>
                    <span className="text-sm text-stone-400">
                      {activeTab === "points" ? "pts" : "day"}
                    </span>
                  </div>
                  {activeTab === "streak" && entry.streak >= 7 && (
                    <span className="text-amber-500 text-xs">🔥 Hot</span>
                  )}
                </div>

                {/* Decks Studied */}
                <div className="w-28 text-right text-[14.5px] text-stone-500">
                  {entry.decksStudied}
                </div>

                {/* Accuracy */}
                <div className="w-20 text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    {entry.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-10">
          <p className="text-[13px] text-stone-400">
            Points are earned through consistent studying, high accuracy, and completing decks.
            <br />
            Keep your streak alive to climb the ranks!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;