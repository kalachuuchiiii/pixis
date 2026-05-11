import { useParams } from "react-router-dom";
import { useFlashcardFilter } from "./useFlashcardFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Flashcard } from "@pixis/schemas";
import api from "@/lib/api";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";

export const useDeckFlashcards = () => {
  const { deckId } = useParams();
  const flashcardFilter = useFlashcardFilter();
  const { query } = flashcardFilter;

  const infiniteDeckFlashcardsQuery = useInfiniteQuery({
    queryKey: ["flashcards", String(deckId), query],
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${6}`, query].join("&");
      const result = await api.get<{
        flashcards: Flashcard[];
        nextPage: number | null;
        totalFlashcards: number;
      }>(`/flashcards/decks/${deckId}?${queries}`);
      return result.data;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!deckId,
  });

  const { data } = infiniteDeckFlashcardsQuery;
  const { ref } = useInViewRefetch(infiniteDeckFlashcardsQuery);

  const flashcards = data?.pages.flatMap((d) => d.flashcards ?? []) ?? [];
  const totalFlashcards = data?.pages[0].totalFlashcards ?? 0;

  return {
    flashcards,
    totalFlashcards,
    flashcardFilter,
    ref,
    ...infiniteDeckFlashcardsQuery,
  };
};
