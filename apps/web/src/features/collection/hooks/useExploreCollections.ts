import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import type { Collection } from "@pixis/schemas";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCollectionFilter } from "./useCollectionFilter";

export const useExploreCollections = () => {
  const collectionFilter = useCollectionFilter();
  const { query } = collectionFilter;
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["explore-collections", query],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<{
        collections: Collection[];
        nextPage: number | null;
      }>(`/collections/explore/?page=${pageParam}&limit=6&${query}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });
  const { data: collectionsData, hasNextPage } = infiniteQuery;
  const collections =
    collectionsData?.pages?.flatMap((p) => p.collections) ?? [];
  const hasNoMoreData = !hasNextPage && collections.length > 0;
  const hasNoData = !hasNextPage && collections.length === 0;
  const { ref } = useInViewRefetch(infiniteQuery);

  return {
    collections,
    hasNoMoreData,
    hasNoData,
    ref,
    collectionFilter,
    ...infiniteQuery,
  };
};
