import { useParams } from "react-router-dom";
import { useFlashcardFilter } from "./useFlashcardFilter";
import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Flashcard } from "@pixis/schemas";
import api from "@/lib/api";
import { useInView } from "react-intersection-observer";

export const useFlashcardList = () => {
  const { deckId } = useParams();
  const flashcardFilterHandlers = useFlashcardFilter();
  const { query } = flashcardFilterHandlers;
  const createFlashcardTriggerRef = useRef<HTMLButtonElement>(null);
  const queryKey = useMemo(() => ["flashcards", String(deckId), query], [deckId, query]);
  
  const { data, refetch, isFetching, isLoading, isPending, hasNextPage } =
    useInfiniteQuery({
      queryKey,
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

  const flashcards = data?.pages.flatMap((d) => d.flashcards ?? []) ?? [];
  const totalFlashcards = data?.pages[0].totalFlashcards ?? 0;
  const isProcessing = isPending || isLoading || isFetching;
  const { ref, inView } = useInView();

  useEffect(() => {
    if (isProcessing || !hasNextPage || !inView) return;
    refetch();
  }, [ref, inView]);

  return {
    flashcards,
    totalFlashcards,
    isProcessing,
    queryKey,
    hasNextPage,
    flashcardFilterHandlers,
    ref,
    createFlashcardTriggerRef,
  };
};
