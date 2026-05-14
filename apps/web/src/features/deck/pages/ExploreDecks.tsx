import { AppHeader } from "@/components/ui/AppHeader";
import { useDeckFilter } from "../hooks/useDeckFilter";
import { DeckFilter } from "../components/DeckFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";
import { DeckDisplay } from "../components/DeckDisplay";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Skeleton } from "boneyard-js/react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { DeckCreatorDialog } from "../components/DeckCreatorDialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useExploreDecks } from "../hooks/useExploreDecks";

const ExploreDecks = () => {
  const { data: user } = useAuthUser();
  const {
    ref,
    deckFilter,
    hasNoMoreData,
    hasNoData,
    decks,
    isPending,
    isFetching,
  } = useExploreDecks();

  return (
    <div className="page-container">
      <AppHeader
        heading="Explore Public Decks"
        description="Discover high-quality flashcards shared by the community. Study
            smarter together."
        beside={
          <div className="w-full flex justify-end">
            <DeckFilter
              deckFilter={deckFilter}
              additionalActions={[
                <Link to={`/app/profile/${user.id}/decks`}>
                  <Button className="my-btn" variant="outline">
                    My Decks
                  </Button>
                </Link>,
                <Link to={`/app/saved-decks`}>
                  <Button className="my-btn" variant="outline">
                    Saved Decks
                  </Button>
                </Link>,
                <DeckCreatorDialog />,
              ]}
            />
          </div>
        }
      />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {decks.map((d) => (
          <DeckDisplay.Default deck={d} />
        ))}
      </main>

      <div className="my-20">
        {isPending || isFetching ? (
          <Spinner />
        ) : hasNoMoreData ? (
          <EmptyResource
            title="No more decks"
            description="No more decks to show"
          />
        ) : (
          hasNoData && (
            <EmptyResource
              title="No decks available"
              description="There is no decks available"
            />
          )
        )}
      </div>
      <div ref={ref} />
    </div>
  );
};

export default ExploreDecks;
