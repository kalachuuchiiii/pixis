import api from "@/lib/api";
import type { TopGlobalUser } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";

export const useLeaderboardDetails = () => {
  const { data = [], ...result } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const result = await api.get<{ topGlobalUsers: TopGlobalUser[] }>(
        `/leaderboards`
      );
      return result.data.topGlobalUsers;
    },
  });
  return {
    data,
    ...result,
  };
};
