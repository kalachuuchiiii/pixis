import type { TopUser } from "@pixis/schemas";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { Trophy, Medal } from "lucide-react";
import firstPlaceTrophy from "/first-place.gif";
import secondPlaceTrophy from "/second-place.gif";
import thirdPlaceTrophy from "/third-place.gif";

export const getRankIcon = (rank: number) => {
  if (rank === 1)
    return <img className="size-6 lg:size-10" src={firstPlaceTrophy} />;
  if (rank === 2)
    return <img className="size-4 lg:size-7" src={secondPlaceTrophy} />;
  if (rank === 3)
    return <img className="size-2 lg:size-5" src={thirdPlaceTrophy} />;
  return null;
};

export const Leaderboard = ({ topUsers }: { topUsers: TopUser[] }) => {
  return (
    <div className="max-w-6xl mx-auto lg:px-4 py-8">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="dark:bg-zinc-900">
            <tr className="border-b border-zinc-800 lg:text-lg text-xs ">
              <th className="py-2 lg:py-5 px-3 lg:px-6 text-left lg:w-16">
                Rank
              </th>
              <th className="py-2 lg:py-5 px-3 lg:px-6 text-left">Student</th>
              <th className="py-2 lg:py-5 px-3 lg:px-6 text-right">Accuracy</th>
              <th className="py-2 lg:py-5 px-3 lg:px-6 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {topUsers.map((user, index) => {
              const rank = index + 1;
              return (
                <tr
                  key={user.username}
                  className="hover:bg-zinc-900/50 transition-colors"
                >
                  <td className=" px-3 lg:px-6">
                    <div className="flex items-center gap-1 lg:gap-3">
                      {getRankIcon(rank)}
                      <span className="font-mono lg:text-sm text-xs text-zinc-400 font-medium">
                        #{rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-2 lg:px-6 text-xs lg:text-base font-medium text-white">
                    <p>{user.nickname || user.username}</p>
                    <p className="opacity-50"> @{user.username}</p>
                  </td>
                  <td className="py-5 px-6 lg:text-base text-xs text-right tabular-nums text-emerald-400">
                    {user.averageAccuracy.toFixed(2)}%
                  </td>
                  <td className="py-5 px-6 lg:text-base text-xs text-right font-semibold text-white tabular-nums">
                    {user.points.toLocaleString()} pts
                  </td>
                </tr>
              );
            })}
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
