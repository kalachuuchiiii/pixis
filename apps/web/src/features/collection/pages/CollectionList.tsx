import { AppHeader } from "@/components/ui/AppHeader";
import React from "react";
import { useCollectionFilter } from "../hooks/useCollectionFilter";
import { CollectionFilter } from "../components/CollectionFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Collection } from "@pixis/schemas";

const CollectionList = () => {
  const collectionFilterHandlers = useCollectionFilter();
  const { query } = collectionFilterHandlers;

  const { data } = useInfiniteQuery({
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

  const collections = data?.pages.flatMap((p) => p.collections) ?? [];

  return (
    <div className="page-container animate-fade-in-right">
      <AppHeader
        heading="My Collections"
        description="Collections of decks"
        beside={
          <div className="w-full">
            <CollectionFilter
              collectionFilterHandlers={collectionFilterHandlers}
            />
          </div>
        }
      />
      <main>
        {
         collections.map(() => <>nice</>)
        }
      </main>
    </div>
  );
};

export default CollectionList;
