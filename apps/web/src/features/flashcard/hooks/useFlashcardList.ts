import { useParams } from "react-router-dom";
import { useFlashcardFilter } from "./useFlashcardFilter";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Flashcard } from "@pixis/schemas";
import api from "@/lib/api";
import { useInView } from "react-intersection-observer";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";

export const useFlashcardList = () => {
  const { deckId } = useParams();
  const flashcardFilterHandlers = useFlashcardFilter();
  const { query } = flashcardFilterHandlers;
  const createFlashcardTriggerRef = useRef<HTMLButtonElement>(null);
  
  const infiniteFlashcardQuery =
    useInfiniteQuery({
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
    });

    const { data, refetch, isFetching, isLoading, isPending, hasNextPage } = infiniteFlashcardQuery;
    const { ref } = useInViewRefetch(infiniteFlashcardQuery);

  const flashcards = data?.pages.flatMap((d) => d.flashcards ?? []) ?? [];
  const totalFlashcards = data?.pages[0].totalFlashcards ?? 0;

  return {
    flashcards,
    totalFlashcards,
    hasNextPage,
    flashcardFilterHandlers,
    ref,
    infiniteFlashcardQuery,
    createFlashcardTriggerRef,
  };
};
