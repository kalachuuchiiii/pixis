import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";

export const useDeckHistory = (userId: string | number) => {
  const { data = [], ...results } = useQuery({
    queryFn: async () => {
      const res = await api.get<{ decks: Deck[] }>(`/users/${userId}/history`);
      return res.data.decks;
    },
    queryKey: ["history", userId],
    staleTime: Infinity,
  });
  return {
    data,
    ...results,
  };
};
