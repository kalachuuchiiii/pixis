import { useDeckLeaderboardsQuery } from "../hooks/useDeckLeaderboards";
import { LeaderboardHeader } from "../components/LeaderboardHeader";
import { Trophy, Medal } from "lucide-react";
import firstPlaceTrophy from "/first-place.gif";
import secondPlaceTrophy from "/second-place.gif";
import thirdPlaceTrophy from "/third-place.gif";

const DeckLeaderboards = () => {
  const { data: topUsers = [] } = useDeckLeaderboardsQuery();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <img className="size-10" src={firstPlaceTrophy} />;
    if (rank === 2) return <img className="size-7" src={secondPlaceTrophy} />;
    if (rank === 3) return <img className="size-5" src={thirdPlaceTrophy} />;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <LeaderboardHeader>Top students by points • This deck</LeaderboardHeader>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="dark:bg-zinc-900">
            <tr className="border-b border-zinc-800">
              <th className="py-5 px-6 text-left w-16">Rank</th>
              <th className="py-5 px-6 text-left">Student</th>
              <th className="py-5 px-6 text-right">Accuracy</th>
              <th className="py-5 px-6 text-right">Points</th>
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
                  <td className=" px-6">
                    <div className="flex items-center gap-3">
                      {getRankIcon(rank)}
                      <span className="font-mono text-zinc-400 font-medium">
                        #{rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6 font-medium text-white">
                    <p>{user.nickname || user.username}</p>
                    <p className="opacity-50"> @{user.username}</p>
                  </td>
                  <td className="py-5 px-6 text-right tabular-nums text-emerald-400">
                    {user.accuracy.toFixed(2)}%
                  </td>
                  <td className="py-5 px-6 text-right font-semibold text-white tabular-nums">
                    {user.deckPoints.toLocaleString()} pts
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
    </div>
  );
};

export default DeckLeaderboards;
