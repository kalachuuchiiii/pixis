import { useDeckFilter } from "@/features/deck/hooks/useDeckFilter";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useCollectionDecks = () => {
  const { collectionId = 0 } = useParams();
  const deckFilter = useDeckFilter();
  const { query } = deckFilter;

  const infiniteCollectionDeckQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const result = await api.get<{ decks: Deck[]; nextPage: number | null }>(
        `/collection-deck/${collectionId}/?page=${pageParam}&limit=${6}&${query}`
      );
      return result.data;
    },
    queryKey: ["collections", collectionId, query],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
    enabled: !!collectionId,
  });
  const { ref } = useInViewRefetch(infiniteCollectionDeckQuery);

  const collectionDecks =
    infiniteCollectionDeckQuery.data?.pages.flatMap((p) => p.decks) ?? [];

  return {
    ...infiniteCollectionDeckQuery,
    ref,
    deckFilter,
    collectionDecks,
  };
};
