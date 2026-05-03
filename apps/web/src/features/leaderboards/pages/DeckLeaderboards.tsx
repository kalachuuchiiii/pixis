import { useDeckLeaderboardsQuery } from "../hooks/useDeckLeaderboards";

import trophy from "/trophy.gif";
import { UserLeaderboardDisplay } from "../components/UserLeaderboardDisplay";
import { LeaderboardHeader } from "../components/LeaderboardHeader";

const DeckLeaderboards = () => {
  const { data: topUsers = [] } = useDeckLeaderboardsQuery();

  return (
    <div className="max-w-7xl">
      <LeaderboardHeader>
        Top students who accumulated the most points with this deck
      </LeaderboardHeader>
      <div className="flex flex-col gap-3">
        {topUsers.map((user, index) => (
          <UserLeaderboardDisplay
            user={user}
            index={index}
            key={user.username}
          />
        ))}
      </div>
    </div>
  );
};

export default DeckLeaderboards;
