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

const ExploreDecks = () => {
  const deckFilter = useDeckFilter(["visibility"]);
  const { query } = deckFilter;
  const { data, isPending, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["explore", query],
      queryFn: async ({ pageParam = 1 }) => {
        const queries = [`page=${pageParam}&limit=${6}`, query].join("&");
        const res = await api.get<{
          decks: Deck[];
          nextPage: number | null;
        }>(`/decks/explore?${queries}`);
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (prev) => prev.nextPage,
    });

  const decks = data?.pages.flatMap((p) => p.decks) ?? [];

  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView || !ref || !hasNextPage || isPending || isFetching) return;
    fetchNextPage();
  }, [inView]);

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
              additionalActions={[<DeckCreatorDialog />]}
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
        ) : !hasNextPage && decks.length > 0 ? (
          <EmptyResource
            title="No more decks"
            description="No more decks to show"
          />
        ) : (
          !hasNextPage && (
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
