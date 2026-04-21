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
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import { useArchive } from "../hooks/useArchive";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "../../../components/ui/EmptyResource";

const ArchivedDecks = () => {
  const deckFilterHandlers = useDeckFilter();
  const {
    selected,
    isSelecting,
    handleToggleIsSelecting,
    handleSelectOrDeselect,
  } = useArchiveSelector();
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
              <DeckFilter deckFilterHandlers={deckFilterHandlers} />

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
        <main className="grid grid-cols-2 gap-2">
          {archivedDecks.map((d) => (
            <div
              onClick={() => handleSelectOrDeselect(d.id)}
              className={clsx(
                "h-fit",
                selected.includes(d.id) &&
                  "outline-emerald-300 shadow-lg shadow-emerald-100 outline rounded-2xl"
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
        {isSelecting && (
          <div className="fixed bottom-10 inset-x-0 flex justify-center z-50">
            <main className="bg-white border h-[8vh] rounded-xl px-4 py-3 shadow-sm w-full max-w-xl flex items-center justify-between">
              {/* Left: selection count */}
              <h1 className="text-sm text-muted-foreground">
                {selected.length} selected
              </h1>

              {/* Middle: actions */}
              <div className="flex items-center gap-2">
                <Button
                  disabled={isRestoringDecks}
                  onClick={() => restoreSelectedIds(selected)}
                  variant="outline"
                  size="sm"
                >
                  <CloudBackup className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => deleteSelectedDecks(selected)}
                  disabled={isDeletingDecks}
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              {/* Right: close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleIsSelecting}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </main>
          </div>
        )}
      </div>
    </>
  );
};

export default ArchivedDecks;
