import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { Spinner } from "@/components/ui/spinner";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { CollectionCard } from "@/features/collection/components/CollectionCard";
import { CollectionFilter } from "@/features/collection/components/CollectionFilter";
import { useCollectionFilter } from "@/features/collection/hooks/useCollectionFilter";
import api from "@/lib/api";
import type { Collection } from "@pixis/schemas";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MySavedCollections = () => {
  const collectionFilter = useCollectionFilter();
  const { data: user } = useAuthUser();
  const infiniteSavedCollectionsQuery = useInfiniteQuery({
    queryKey: ["collections"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<{
        collections: Collection[];
        nextPage: number | null;
      }>(`/user-saved-collections?page=${pageParam}&limit=6`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });
  const {
    data: collectionsData,
    hasNextPage,
    isFetching,
    isLoading,
  } = infiniteSavedCollectionsQuery;
  const collections =
    collectionsData?.pages?.flatMap((p) => p.collections) ?? [];

  const hasNoMoreData = !hasNextPage && collections.length > 0;
  const hasNoData = !hasNextPage && collections.length === 0;

  return (
    <div className="page-container">
      <AppHeader
        beside={
          <CollectionFilter
            additionalActions={[
              <Link to={`/app/profile/${user.id}/decks`}>
                <Button variant={"outline"} className="my-btn">
                  <ChevronLeft />
                </Button>
              </Link>,
            ]}
            collectionFilter={collectionFilter}
          />
        }
        heading="Saved Collections"
        description="Save collections for later study"
      />
      <main className="grid grid-cols-3 gap-1">
        {collections.map((c) => (
          <Link to={`/app/collections/${c.id}`}>
            <CollectionCard.Default collection={c} />
          </Link>
        ))}
      </main>
      <div className="my-20 ">
        {isFetching || isLoading ? (
          <Spinner />
        ) : hasNoMoreData ? (
          <EmptyResource
            title="No more collections"
            description="You've reached the last page"
          />
        ) : (
          hasNoData && (
            <EmptyResource
              title="No collections"
              description="No collections found"
            />
          )
        )}
      </div>
    </div>
  );
};

export default MySavedCollections;
