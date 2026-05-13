import { useInfiniteQuery } from "@tanstack/react-query";
import { useCollectionFilter } from "./useCollectionFilter";
import api from "@/lib/api";
import { IDSchema, type Collection } from "@pixis/schemas";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import { useParams } from "react-router-dom";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export const useCollections = (blacklistedFields?: ["visibility"]) => {
  const { userId = "0" } = useParams();
  const { data: user } = useAuthUser();
  const collectionFilterHandlers = useCollectionFilter(blacklistedFields);
  const { query } = collectionFilterHandlers;

  const infiniteCollectionQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${10}`, query].join("&");
      const cleanId = IDSchema.catch(0).parse(userId) || user.id;

      const res = await api.get<{
        collections: Collection[];
        nextPage: number | undefined;
        totalItems: number;
      }>(`/collections/${cleanId}/list/?${queries}`);
      return res.data;
    },
    queryKey: ["collections", userId, query],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });
  const { ref } = useInViewRefetch(infiniteCollectionQuery);

  const { data, isFetching, isPending } = infiniteCollectionQuery;
  const collections = data?.pages.flatMap((p) => p.collections) ?? [];
  const hasNoMoreData = collections.length > 0 && !isFetching && !isPending;
  const hasNoData = collections.length === 0 && !isFetching && !isPending;

  return {
    collections,
    ref,
    hasNoData,
    hasNoMoreData,
    ...infiniteCollectionQuery,
    collectionFilterHandlers,
  };
};
