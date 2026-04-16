import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { useDeckFilter } from "../hooks/useDeckFilter";
import { DeckFilter } from "../components/DeckFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { DeckWithAuthorAndFlashcardPreview } from "@pixis/schemas";
import { DeckCard } from "../components/DeckCard";

type SortOption = "createdAt" | "popularity";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "createdAt", label: "Newest" },
  { value: "popularity", label: "Most Popular" },
];

const PublicDecksPage = () => {
  const deckFilterHandlers = useDeckFilter({ hideDeckVisibilityOption: true });
  const { query } = deckFilterHandlers;
  const { data } = useInfiniteQuery({
    queryKey: ["explore", query],
    queryFn: async ({ pageParam = 1 }) => {
      const queries = [`page=${pageParam}&limit=${6}`, query].join("&");
      const res = await api.get<{
        decks: DeckWithAuthorAndFlashcardPreview[];
        nextPage: number | null;
      }>(`/decks/explore?${queries}`);
      console.log(res);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });

  const decks = data?.pages.flatMap((p) => p.decks) ?? [];

  return (
    <div className="page-container">
      <AppHeader
        heading="Explore Public Decks"
        description="Discover high-quality flashcards shared by the community. Study
            smarter together."
        beside={
          <div className="w-full flex justify-end">
            <DeckFilter
              className="w-full"
              deckFilterHandlers={deckFilterHandlers}
            />
          </div>
        }
      />
      <div className=" ">
        {/* Deck Display Section - Placeholder */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[17px] font-semibold text-stone-800">
              Public Decks
            </h2>
            <div className="text-[13px] text-stone-400">
              1,284 decks • 42 added this week
            </div>
          </div>
        </div>
      </div>
      <main className="grid grid-cols-2 gap-1">
        {decks.map((d) => (
          <DeckCard.Default deck={d} />
        ))}
      </main>
    </div>
  );
};

export default PublicDecksPage;
