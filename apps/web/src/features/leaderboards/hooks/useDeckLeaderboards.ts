import api from "@/lib/api";
import type { TopDeckUser, TopUser } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useDeckLeaderboardsQuery = () => {
  const { deckId = 0 } = useParams();
  return useQuery({
    queryFn: async () => {
      const res = await api.get<{ topUsers: TopUser[] }>(
        `/leaderboards/${deckId}/deck`
      );
      return res.data.topUsers;
    },
    queryKey: ["leaderboards", deckId],
    staleTime: Infinity,
  });
};
