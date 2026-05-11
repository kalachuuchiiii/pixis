import api from "@/lib/api";
import type { TopUser } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";

export const useLeaderboardDetails = () => {
  const { data = [], ...result } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const result = await api.get<{ topUsers: TopUser[] }>(`/leaderboards`);
      return result.data.topUsers;
    },
  });
  return {
    data,
    ...result,
  };
};
