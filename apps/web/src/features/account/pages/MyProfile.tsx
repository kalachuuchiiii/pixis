import { PixisAvatar } from "@/components/ui/PixisAvatar";

const MyProfile = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 h-[60px] px-8 flex items-center justify-between">
        <PixisAvatar />
        <div className="text-sm text-stone-500 font-medium">My Profile</div>
        <a
          href="/"
          className="text-[13.5px] text-stone-500 hover:text-stone-900 transition-colors"
        >
          ← Home
        </a>
      </nav>

      <div className="lg:px-8 max-w-7xl mx-auto pt-12 pb-20">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
          {/* Avatar & Basic Info */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-stone-800 to-black flex items-center justify-center text-white text-6xl shadow-inner">
              👤
            </div>
            <div className="mt-6 text-center md:text-left">
              <h1 className="text-3xl font-semibold text-stone-900">
                Alex Rivera
              </h1>
              <p className="text-stone-500">@alexrivera</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {/* Streak */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <p className="text-[13px] font-semibold tracking-widest uppercase text-stone-400 mb-2">
                CURRENT STREAK
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-normal text-stone-900 tabular-nums">
                  14
                </span>
                <span className="text-2xl text-amber-500">🔥</span>
              </div>
              <p className="text-sm text-stone-500 mt-1">days in a row</p>
            </div>

            {/* Points */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <p className="text-[13px] font-semibold tracking-widest uppercase text-stone-400 mb-2">
                TOTAL POINTS
              </p>
              <div className="text-5xl font-normal text-stone-900 tabular-nums">
                10,750
              </div>
              <p className="text-sm text-emerald-600 mt-1">+240 this week</p>
            </div>

            {/* Leaderboard Rank */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <p className="text-[13px] font-semibold tracking-widest uppercase text-stone-400 mb-2">
                GLOBAL RANK
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-normal text-amber-500">#3</span>
                <span className="text-stone-400 text-sm">of 12,459</span>
              </div>
              <p className="text-sm text-stone-500 mt-1">Top 0.02%</p>
            </div>

            {/* Joined */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 col-span-2 md:col-span-1">
              <p className="text-[13px] font-semibold tracking-widest uppercase text-stone-400 mb-2">
                JOINED
              </p>
              <div className="text-3xl font-medium text-stone-900">
                March 12, 2025
              </div>
            </div>

            {/* Decks Answered */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <p className="text-[13px] font-semibold tracking-widest uppercase text-stone-400 mb-1">
                DECKS STUDIED
              </p>
              <div className="text-4xl font-semibold text-stone-900">87</div>
              <p className="text-xs text-stone-500">Total decks completed</p>
            </div>

            {/* Flashcards Answered */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <p className="text-[13px] font-semibold tracking-widest uppercase text-stone-400 mb-1">
                FLASHCARDS ANSWERED
              </p>
              <div className="text-4xl font-semibold text-stone-900">2,348</div>
              <p className="text-xs text-stone-500">Across all sessions</p>
            </div>

            {/* Overall Accuracy */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 md:col-span-2 lg:col-span-1">
              <p className="text-[13px] font-semibold tracking-widest uppercase text-stone-400 mb-2">
                OVERALL ACCURACY
              </p>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-normal text-emerald-600">
                  89.4
                </span>
                <span className="text-2xl text-emerald-600">%</span>
              </div>
              <p className="text-sm text-stone-500">
                Win rate on all flashcards
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-stone-900">
            Recent Activity
          </h2>
          <span className="text-sm text-stone-400">
            Last 3 flashcards answered
          </span>
        </div>

        {/* Space for Last 3 Flashcards */}
        <div className="border border-dashed border-stone-200 rounded-3xl p-12 text-center min-h-[320px] flex items-center justify-center">
          <div className="max-w-xs">
            <p className="text-stone-400 text-sm mb-2">📇</p>
            <p className="font-medium text-stone-600">
              Last 3 flashcards answered
            </p>
            <p className="text-xs text-stone-400 mt-1">
              This section will display your most recent flashcard activity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
