import { useEffect, useRef, useState } from "react";
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { CreateDeckDialog } from "../components/CreateDeckDialog";
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import api from "@/lib/api";
import {  type DeckWithAuthorAndFlashcardPreview } from "@pixis/schemas";
import { DeckFilter } from "@/features/deck/components/DeckFilter";
import { Link, useSearchParams } from "react-router-dom";
import { useDeckFilter } from "../hooks/useDeckFilter";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import { useInView } from "react-intersection-observer";
import { AppHeader } from "@/components/ui/AppHeader";
import { DeckCard } from "../components/DeckCard";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyResource } from "../../../components/ui/EmptyResource";
import { Spinner } from "@/components/ui/spinner";

const MyDecks = () => {
  const deckFilterHandlers = useDeckFilter();
  const { query } = deckFilterHandlers;
  const createDeckButtonRef = useRef<HTMLButtonElement | null>(null);
  const infiniteQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${4}`];
      if (query) {
        queries.push(query);
      }
      const res = await api.get<{
        decks: DeckWithAuthorAndFlashcardPreview[];
        nextPage: number | null;
      }>(`/decks/?${queries.join("&")}`);
      return res.data;
    },
    queryKey: ["my-decks", deckFilterHandlers.query],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });
  const { data, isPending, isLoading, isFetching, hasNextPage, fetchNextPage } =
    infiniteQuery;

  const decks = data?.pages.flatMap((d) => d.decks) ?? [];
  const isProcessing = isPending || isLoading || isFetching || !data;
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!hasNextPage || isProcessing || !ref || !inView) return;
    fetchNextPage();
  }, [inView, ref]);

  const hasNoDecks = !hasNextPage && decks.length === 0;

  return (
    <div className="page-container animate-fade-in-right">
      <AppHeader
        heading={`My Decks`}
        description="Manage and continue studying your personal decksk"
        beside={
          <div className="flex items-center h-12  justify-end w-full gap-1">
            <DeckFilter deckFilterHandlers={deckFilterHandlers} />
            <Tooltip>
              <TooltipTrigger>
                <Link to={`/app/archived/decks`}>
                  <Button variant={"outline"} className="my-btn h-full">
                    <Archive />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to archived decks</TooltipContent>
            </Tooltip>
            <CreateDeckDialog ref={createDeckButtonRef} />
          </div>
        }
      />
      <div>
        <div className="space-y-2 grid grid-cols-2 gap-1">
          {decks.map((d) => (
            <DeckCard.Default key={`${d.topic}.${d.id}`} deck={d} />
          ))}
        </div>
        <div className=" h-20 my-20">
          {isProcessing ? (
            <Spinner className="w-full my-auto mx-auto" />
          ) : hasNoDecks ? (
            <EmptyResource
              title="No decks yet"
              description="No decks yet. Start by creating one"
              content={
                <Button onClick={() => createDeckButtonRef.current?.click()}>
                  Create
                </Button>
              }
            />
          ) : (
            !hasNextPage && (
              <EmptyResource
                title="No more decks"
                description="No more decks to show"
                content={
                  <Link to={"/app/explore"}>
                    <Button>Explore</Button>
                  </Link>
                }
              />
            )
          )}
        </div>
      </div>
      <div className="h-2 w-full" ref={ref} />
    </div>
  );
};

export default MyDecks;
