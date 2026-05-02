import api from "@/lib/api";
import type { Deck, DeckWithAuthor } from "@pixis/schemas";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import React from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { useDeckFilter } from "../hooks/useDeckFilter";
import { DeckFilter } from "../components/DeckFilter";
import { DeckDisplay } from "../components/DeckDisplay";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  CloudBackup,
  MousePointerClick,
  Trash,
  X,
} from "lucide-react";
import { useArchiveSelector } from "../hooks/useArchiveSelector";
import clsx from "clsx";
import { useArchive } from "../hooks/useArchive";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "../../../components/ui/EmptyResource";
import { SelectedDeckActions } from "../components/SelectedDeckActions";

const ArchivedDecks = () => {
  const deckFilterHandlers = useDeckFilter();
  const archiveSelector = useArchiveSelector();
  const {
    selected,
    isSelecting,
    handleToggleIsSelecting,
    handleSelectOrDeselect,
  } = archiveSelector;
  const { query } = deckFilterHandlers;
  const { data, isPending, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["archived", query],
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${4}`];
      if (query) {
        queries.push(query);
      }
      const result = await api.get<{
        nextPage: number | undefined;
        archivedDecks: DeckWithAuthor[];
      }>(`/decks/archived?${queries.join("&")}`);
      return result.data;
    },
    initialPageParam: 1,
    getNextPageParam: (res) => res.nextPage,
  });

  const archivedDecks = data?.pages.flatMap((p) => p.archivedDecks) ?? [];

  const {
    deleteSelectedDecks,
    restoreSelectedIds,
    isDeletingDecks,
    isRestoringDecks,
  } = useArchive(query);

  return (
    <>
      <div className="animate-fade-in-right page-container">
        <AppHeader
          heading="Archived Decks"
          description="Restore or permanently delete decks"
          beside={
            <div className="w-full gap-1 flex items-center justify-end">
              <DeckFilter deckFilter={deckFilterHandlers} />

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleToggleIsSelecting}
                    variant={isSelecting ? "default" : "outline"}
                    className="my-btn"
                  >
                    <MousePointerClick />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Select multiple</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Link to={"/app/decks"}>
                    <Button className="my-btn h-full" variant={"outline"}>
                      <ChevronLeft />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Go back to my decks</TooltipContent>
              </Tooltip>
            </div>
          }
        />
        <main className="grid grid-cols-3 gap-4">
          {archivedDecks.map((d) => (
            <div
              onClick={() => handleSelectOrDeselect(d.id)}
              className={clsx(
                "h-fit",
                selected.includes(d.id) &&
                  "outline-2 outline-offset-6  outline-green-400  rounded-xl"
              )}
            >
              <DeckDisplay.Default deck={d} />
            </div>
          ))}
        </main>
        <div className="my-10">
          {isPending || isFetching ? (
            <Spinner className="h-20 mx-auto text-center" />
          ) : !hasNextPage && archivedDecks.length === 0 ? (
            <EmptyResource
              title="No archived decks yet"
              description="No archive decks yet"
            />
          ) : (
            !hasNextPage && (
              <EmptyResource
                title="No more archived decks"
                description="No more archived decks to show"
              />
            )
          )}
        </div>
      </div>
      <div className="relative w-full">
        {isSelecting && <SelectedDeckActions {...archiveSelector} />}
      </div>
    </>
  );
};

export default ArchivedDecks;
