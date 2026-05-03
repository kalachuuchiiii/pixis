import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import type { Session } from "@pixis/schemas";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useDeckSessions = () => {
  const { deckId = 0 } = useParams();
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["sessions", deckId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<{
        sessions: Session[];
        nextPage: number | null;
      }>(`/decks/${deckId}/sessions?page=${pageParam}&limit=6`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
    enabled: !!deckId,
    staleTime: Infinity,
  });
  const { data: sessionsData, hasNextPage } = infiniteQuery;
  const sessions = sessionsData?.pages?.flatMap((p) => p.sessions) ?? [];
  const hasNoMoreData = !hasNextPage && sessions.length > 0;
  const hasNoData = !hasNextPage && sessions.length === 0;
  const { ref } = useInViewRefetch(infiniteQuery);

  return {
    sessions,
    hasNoMoreData,
    hasNoData,
    ref,
    ...infiniteQuery,
  };
};
