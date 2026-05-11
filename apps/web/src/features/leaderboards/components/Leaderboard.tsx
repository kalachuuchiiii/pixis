import type { TopUser } from "@pixis/schemas";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { Trophy, Medal } from "lucide-react";
import firstPlaceTrophy from "/first-place.gif";
import secondPlaceTrophy from "/second-place.gif";
import thirdPlaceTrophy from "/third-place.gif";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { toOrdinal } from "@/utils/toOrdinal";
import { TopUserRow } from "./TopUserRow";
import { Skeleton } from "boneyard-js/react";
import { initialTopUserData } from "../data/leaderboard";

export const getRankIcon = (rank: number) => {
  if (rank === 1)
    return <img className="size-8 lg:size-12" src={firstPlaceTrophy} />;
  if (rank === 2)
    return <img className="size-6 lg:size-10" src={secondPlaceTrophy} />;
  if (rank === 3)
    return <img className="size-4 lg:size-8" src={thirdPlaceTrophy} />;
  return null;
};

export const Leaderboard = ({ topUsers }: { topUsers: TopUser[] }) => {
  return (
    <div className="max-w-6xl mx-auto lg:px-4 py-8">
      <div className="bg-neutral-100 dark:text-neutral-100 text-zinc-900 dark:bg-zinc-950  border border-neutral-300 dark:border-zinc-800 rounded-lg lg:rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-zinc-900">
            <tr className="border-b border-neutral-300 dark:border-zinc-800 lg:text-lg text-xs ">
              <th className="py-2 lg:py-5 p-1 lg:p-6 text-left lg:w-16">
                Rank
              </th>
              <th className="py-2 lg:py-5 p-1 lg:p-6 text-left">Student</th>
              <th className=" lg:py-5 p-1 lg:p-6 text-right">Accuracy</th>
              <th className=" lg:py-5 p-1 lg:p-6 text-right">Points</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-300 w-full dark:bg-zinc-900 bg-neutral-50 dark:divide-zinc-800">
            {topUsers.length > 0
              ? topUsers.map((user) => <TopUserRow key={user.id} user={user} />)
              : Array.from({ length: 5 }).map((_, idx) => (
                  <TopUserRow user={initialTopUserData} />
                ))}
          </tbody>
        </table>

        {topUsers.length === 0 && (
          <div className="py-20 text-center text-zinc-500">
            No data available yet
          </div>
        )}
      </div>
      <p className="text-xs lg:text-base opacity-75 text-center my-6 ">
        Leaderboards are based on the total points users have accumulated over
        their entire time using the app.
      </p>
    </div>
  );
};
