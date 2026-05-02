import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { useProfileDetails } from "../hooks/useProfileDetails";
import streakFire from "/streak-fire.gif";
import { useDeckHistory } from "@/features/deck/hooks/useDeckHistory";
import { DeckDisplay } from "@/features/deck/components/DeckDisplay";
import clsx from "clsx";

const MyProfile = () => {
  const { data: user } = useProfileDetails();
  const { data: decks } = useDeckHistory(user.id);

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-24">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-20">
          {/* Avatar & Name Section */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="size-60">
                <AvatarImage src={user.avatarPublicUrl ?? undefined} />
                <AvatarFallback className="text-[700%]">
                  {user.username.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-8 text-center lg:text-left">
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                {user.nickname || user.username}
              </h1>
              <p className="text-zinc-500 mt-1 text-lg">@{user.username}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-2xl text-sm font-medium">
                Edit Profile
              </button>
              <button className="px-6 py-2.5 border border-zinc-700 hover:border-zinc-600 transition-colors rounded-2xl text-sm font-medium">
                Share Profile
              </button>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/30 transition-colors group">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-semibold tracking-[2px] uppercase text-zinc-500">
                  STREAK
                </p>
                <img src={streakFire} className="size-10" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-semibold text-white tabular-nums tracking-tighter">
                  {user.streak.currentStreak}
                </span>
                <span className="text-2xl text-amber-500 font-medium">
                  day(s)
                </span>
              </div>
            </div>

            <div className="bg-zinc-900 translate-y-2 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors">
              <p className="text-xs font-semibold tracking-[2px] uppercase text-zinc-500 mb-6">
                POINTS
              </p>
              <div className="text-6xl font-semibold text-white tabular-nums tracking-tighter">
                {user.point.currentPoints}
              </div>
              <p className="mt-3 text-emerald-400 text-sm flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full" />
                +240 this week
              </p>
            </div>

            <div className="bg-zinc-900 translate-y-4 border border-zinc-800 rounded-3xl p-8 hover:border-amber-500/30 transition-colors">
              <p className="text-xs font-semibold tracking-[2px] uppercase text-zinc-500 mb-6">
                GLOBAL RANK
              </p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-semibold text-amber-400 tracking-tighter">
                  #3
                </span>
                <div className="text-zinc-500 text-sm leading-tight">
                  of 12,459
                  <br />
                  <span className="text-amber-400/80">Top 0.02%</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900  border  border-zinc-800 rounded-3xl p-8 col-span-2 lg:col-span-1">
              <p className="text-xs font-semibold tracking-[2px] uppercase text-zinc-500 mb-6">
                MEMBER SINCE
              </p>
              <div className="text-3xl font-medium text-zinc-100">
                {new Date(user.createdAt).toDateString()}
              </div>
            </div>

            <div className="bg-zinc-900 translate-y-2  border border-zinc-800 rounded-3xl p-8">
              <p className="text-xs font-semibold tracking-[2px] uppercase text-zinc-500 mb-4">
                DECKS STUDIED
              </p>
              <div className="text-5xl font-semibold text-white">87</div>
              <p className="text-zinc-500 text-sm mt-1">completed</p>
            </div>

            <div className="bg-zinc-900 border translate-y-4  border-zinc-800 rounded-3xl p-8">
              <p className="text-xs font-semibold tracking-[2px] uppercase text-zinc-500 mb-4">
                FLASHCARDS ANSWERED
              </p>
              <div className="text-5xl font-semibold text-white">2,348</div>
              <p className="text-zinc-500 text-sm mt-1">across all sessions</p>
            </div>

            <div className="bg-zinc-900  border border-zinc-800 rounded-3xl p-8 lg:col-span-2 xl:col-span-1">
              <p className="text-xs font-semibold tracking-[2px] uppercase text-zinc-500 mb-6">
                OVERALL ACCURACY
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-semibold text-emerald-400">
                  89.4
                </span>
                <span className="text-4xl text-emerald-500/70">%</span>
              </div>
              <p className="text-sm text-zinc-500 mt-2">
                Win rate on all flashcards
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              Recent Activity
            </h2>
            <span className="text-sm text-zinc-500">Last 3 decks answered</span>
          </div>
          <main className="grid gap-6  grid-cols-2 lg:grid-cols-3  ">
            {decks.map((d, i) => (
              <div
                key={d.id}
                className={clsx(`translate-y-${2 * i} opacity-${100 - 35 * i}`)}
              >
                <DeckDisplay.Default deck={d} />
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
