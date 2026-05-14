import { useInfiniteQuery } from "@tanstack/react-query";
import { useDeckFilter } from "./useDeckFilter";

import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";

export const useExploreDecks = () => {
  const deckFilter = useDeckFilter(["visibility"]);
  const { query } = deckFilter;
  const deckQuery = useInfiniteQuery({
    queryKey: ["explore", query],
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${6}`, query].join("&");
      const res = await api.get<{
        decks: Deck[];
        nextPage: number | null;
      }>(`/decks/explore?${queries}`);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });
  const { data, ...result } = deckQuery;
  const decks = data?.pages.flatMap((p) => p.decks) ?? [];
  const { ref } = useInViewRefetch(deckQuery);
  const hasNoData = !result.hasNextPage && decks.length === 0;
  const hasNoMoreData = !result.hasNextPage && decks.length > 0;

  return {
    ref,
    ...result,
    hasNoData,
    hasNoMoreData,
    decks,
    deckFilter,
  };
};
