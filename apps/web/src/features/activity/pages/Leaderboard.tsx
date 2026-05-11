import clsx from "clsx";
import { Crown, Medal, Trophy } from "lucide-react";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { useLeaderboardDetails } from "../../leaderboards/hooks/useLeaderboardDetails";
import { LeaderboardHeader } from "@/features/leaderboards/components/LeaderboardHeader";
import { Leaderboard } from "@/features/leaderboards/components/Leaderboard";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const LeaderboardPage = () => {
  const { data: user } = useAuthUser();
  const { data: topUsers } = useLeaderboardDetails();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <LeaderboardHeader>Top 10 students all over the globe </LeaderboardHeader>
      <Leaderboard topUsers={topUsers} />
    </div>
  );
};

export default LeaderboardPage;
