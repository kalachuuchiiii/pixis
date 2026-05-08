import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { useProfileDetails } from "../hooks/useProfileDetails";
import streakFire from "/streak-fire.gif";
import { useDeckHistory } from "@/features/deck/hooks/useDeckHistory";
import { DeckDisplay } from "@/features/deck/components/DeckDisplay";
import clsx from "clsx";
import { UserBadge } from "../components/ui/UserBadge";
import { toOrdinal } from "@/utils/toOrdinal";
import { getRankIcon } from "@/features/leaderboards/components/Leaderboard";
import { Separator } from "@/components/ui/separator";

const MyProfile = () => {
  const { data: user } = useProfileDetails();
  const { data: decks } = useDeckHistory(user.id);

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-2 lg:px-8 pt-12 pb-24">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-20">
          {/* Avatar & Name Section */}
          <div className="flex-shrink-0 flex flex-col items-centergap-2">
            <div className="relative">
              <UserBadge user={user}>
                <UserBadge.Avatar className="size-50 outline-4 outline-blue-400 outline-offset-4" />
              </UserBadge>
            </div>

            <div className="mt-8 text-center ">
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                {user.nickname || user.username}
              </h1>
              <p className="text-zinc-500 mt-1 text-lg">@{user.username}</p>
            </div>
          </div>

          <div className="flex-1 w-full grid lg:text-base text-xs grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
            <div className="bg-zinc-900  translate-y-0 col-span-1 border h-fit lg:h-full border-zinc-800 rounded-3xl p-4 lg:p-8 hover:border-amber-500/30 transition-colors">
              <p className=" opacity-50  mb-2">Global Rank</p>
              <div className="flex items-baseline gap-4">
                <span className="text-lg lg:text-6xl flex flex-col font-semibold text-amber-400 tracking-tighter">
                  <div className="flex items-center gap-2">
                    {getRankIcon(user.rank)} {toOrdinal(user.rank)}{" "}
                  </div>
                  <span className="text-xs lg:text-sm opacity-75 font-normal tracking-normal dark:text-neutral-100">
                    {" "}
                    among the <span className="text-amber-400">
                      {" "}
                      12,453
                    </span>{" "}
                    users
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-zinc-900 border translate-y-2 border-zinc-800 rounded-3xl h-fit lg:h-full p-4 lg:p-8 hover:border-amber-500/30 transition-colors">
              <p className=" opacity-50  mb-2">Streak</p>

              <div className="flex flex-col">
                <div className="flex items-center  font-semibold text-white  tracking-tighter">
                  <div className="text-lg lg:text-6xl flex items-center gap-1 tabular-nums">
                    <img src={streakFire} className="size-5 lg:size-10" />{" "}
                    <p> {user.streak.currentStreak} day(s)</p>
                  </div>
                </div>
                <p className=" font-normal tracking-normal opacity-75">
                  answer daily for streaks!
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 translate-y-4 border border-zinc-800 rounded-3xl p-4 h-fit lg:h-full lg:p-8 hover:border-emerald-500/30 transition-colors">
              <div>
                <p className=" opacity-50  mb-2">Points</p>
                <div className="text-lg lg:text-6xl font-semibold flex items-end gap-2 text-white tabular-nums tracking-tighter">
                  <p> {user.point.currentPoints} pts</p>{" "}
                </div>
              </div>
              <p className="text-sm opacity-75">
                crush flashcards for more points!
              </p>
            </div>

            <div className="bg-zinc-900  border translate-y-6 lg:translate-y-0 border-zinc-800 rounded-3xl p-4 lg:p-8 ">
              <p className=" opacity-50  mb-2">Here since</p>
              <div className="lg:text-6xl text-lg font-medium text-zinc-100">
                {new Date(user.createdAt).toDateString()}
              </div>
            </div>

            <div className="bg-zinc-900 translate-y-8 lg:translate-y-2 h-fit lg:h-full border border-zinc-800 rounded-3xl p-4 lg:p-8">
              <p className=" opacity-50  mb-2">Decks Studied</p>
              <div className="text-lg lg:text-6xl font-semibold flex items-end gap-2 text-white">
                {user.deckStudiedCount} decks
              </div>
              <p className="opacity-75">all decks you've studied</p>
            </div>

            <div className="bg-zinc-900 border translate-y-10 lg:translate-y-4 h-fit lg:h-full border-zinc-800 rounded-3xl p-4 lg:p-8">
              <p className=" opacity-50  mb-2">Flashcards answered</p>
              <div className="text-lg lg:text-6xl font-semibold text-white flex items-end gap-2">
                {user.flashcardAnsweredCount} cards
              </div>
              <p className="opacity-75">repetitions count</p>
            </div>

            <div className="bg-zinc-900 translate-y-14 lg:translate-y-4 rotate-1 border border-zinc-800 rounded-3xl p-8 lg:col-span-3 col-span-2">
              <p className="opacity-50 mb-2">Overall accuracy</p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-semibold text-emerald-400">
                  {user.averageAccuracy.toFixed(2)}
                </span>
                <span className="text-4xl text-emerald-500/70">%</span>
              </div>
              <p className="opacity-75 text-sm">Win rate on all flashcards</p>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              Recent Activity
            </h2>
            <span className=" text-zinc-500">Last 3 decks answered</span>
          </div>
          <main className="grid gap-4  grid-cols-1 lg:grid-cols-3  ">
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
