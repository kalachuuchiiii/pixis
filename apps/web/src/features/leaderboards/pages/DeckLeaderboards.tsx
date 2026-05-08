import { useDeckLeaderboardsQuery } from "../hooks/useDeckLeaderboards";
import { LeaderboardHeader } from "../components/LeaderboardHeader";
import { Leaderboard } from "../components/Leaderboard";

const DeckLeaderboards = () => {
  const { data: topUsers = [] } = useDeckLeaderboardsQuery();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <LeaderboardHeader>Top students by points • This deck</LeaderboardHeader>
      <Leaderboard topUsers={topUsers} />
    </div>
  );
};

export default DeckLeaderboards;
