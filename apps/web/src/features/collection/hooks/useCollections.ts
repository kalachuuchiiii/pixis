import { useInfiniteQuery } from "@tanstack/react-query";
import { useCollectionFilter } from "./useCollectionFilter";
import api from "@/lib/api";
import type { Collection } from "@pixis/schemas";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";

export const useCollections = () => {
  const collectionFilterHandlers = useCollectionFilter();
  const { query } = collectionFilterHandlers;

  const infiniteCollectionQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${10}`, query].join("&");
      const res = await api.get<{
        collections: Collection[];
        nextPage: number | undefined;
        totalItems: number;
      }>(`/collections/?${queries}`);
      return res.data;
    },
    queryKey: ["collections", query],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });
  const { ref } = useInViewRefetch(infiniteCollectionQuery);

  const { data } = infiniteCollectionQuery;
  const collections = data?.pages.flatMap((p) => p.collections) ?? [];

  return {
    collections,
    ref,
    infiniteCollectionQuery,
    collectionFilterHandlers
  };
};
