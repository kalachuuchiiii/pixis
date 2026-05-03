import React from "react";
import { useExploreCollections } from "../hooks/useExploreCollections";
import { CollectionCard } from "../components/CollectionCard";
import { AppHeader } from "@/components/ui/AppHeader";
import { CollectionFilter } from "../components/CollectionFilter";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";

const ExploreCollections = () => {
  const {
    collections,
    collectionFilter,
    isPending,
    isFetching,
    hasNoData,
    hasNoMoreData,
  } = useExploreCollections();

  return (
    <div className="page-container">
      <AppHeader
        heading="Explore Collections"
        description="Discover and browse curated collections"
        beside={<CollectionFilter collectionFilter={collectionFilter} />}
      />
      <main className="grid grid-cols-3 gap-4 ">
        {collections.map((c) => (
          <Link to={`/app/collections/${c.id}`}>
            <CollectionCard.Default collection={c} />
          </Link>
        ))}
      </main>
      <footer className="my-20">
        {isPending || isFetching ? (
          <Spinner />
        ) : hasNoData ? (
          <EmptyResource
            title="No collections yet"
            description="Collections will appear here once they’re available."
          />
        ) : (
          hasNoMoreData && (
            <EmptyResource
              title="You’ve reached the end"
              description="No more collections to load right now."
            />
          )
        )}
      </footer>
    </div>
  );
};

export default ExploreCollections;
