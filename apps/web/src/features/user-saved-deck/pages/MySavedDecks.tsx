import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { Spinner } from "@/components/ui/spinner";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { DeckDisplay } from "@/features/deck/components/DeckDisplay";
import { DeckFilter } from "@/features/deck/components/DeckFilter";
import { useDeckFilter } from "@/features/deck/hooks/useDeckFilter";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronLeft, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const MySavedDecks = () => {
  const deckFilter = useDeckFilter();
  const { query } = deckFilter;
  const { data: user } = useAuthUser();
  const infiniteSavedDecksQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${6}`, query].join("&");
      const res = await api.get<{ decks: Deck[]; nextPage: number | null }>(
        `/user-saved-deck/?${queries}`
      );
      return res.data;
    },
    queryKey: ["user-saved-decks", query],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });
  const { data, isPending, isFetchingNextPage, hasNextPage } =
    infiniteSavedDecksQuery;

  const savedDecks = data?.pages.flatMap((p) => p.decks) ?? [];
  const { ref } = useInViewRefetch(infiniteSavedDecksQuery);

  return (
    <div className="page-container">
      <AppHeader
        heading="Your saved decks"
        description="You can save decks here to study later"
        beside={
          <DeckFilter
            deckFilter={deckFilter}
            additionalActions={[
              <Link to={`/app/profile/${user.id}/decks`}>
                <Button variant={"outline"} className="my-btn">
                  <Layers /> My decks
                </Button>
              </Link>,
            ]}
          />
        }
      />
      <main className="grid grid-cols-3 gap-4">
        {savedDecks.map((d) => (
          <DeckDisplay.Default deck={d} />
        ))}
      </main>
      <footer className="my-20">
        {isPending || isFetchingNextPage ? (
          <Spinner />
        ) : !hasNextPage && savedDecks.length === 0 ? (
          <EmptyResource
            title="No saved decks yet"
            description="You currently have no saved decks"
          />
        ) : (
          !hasNextPage &&
          savedDecks.length > 0 && (
            <EmptyResource
              description="Save more decks here"
              title="No more decks to show"
            />
          )
        )}
      </footer>
      <div ref={ref} />
    </div>
  );
};

export default MySavedDecks;
