import { useState } from "react";
import DeckPreviewCard from "../components/DeckCard";
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { CreateDeckDialog } from "../components/CreateDeckDialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";
import { DeckFilter } from "@/components/DeckFilter";
import { useSearchParams } from "react-router-dom";
import { useDeckFilter } from "../hooks/useDeckFilter";

const MyDecks = () => {
  const [searchQuery] = useSearchParams();
  const deckFilterHandlers = useDeckFilter();

  const { data } = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<{ decks: Deck[]; nextPage: number | null }>(
        `/decks/?page=${pageParam}&limit=${10}&${deckFilterHandlers.updatedQuery}`
      );
      return res.data;
    },
    queryKey: ["my-decks", deckFilterHandlers.updatedQuery],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
  });

  const decks = data?.pages.flatMap((d) => d.decks);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 h-[60px] px-8 flex items-center justify-between">
        <PixisAvatar />
        <div className="text-sm text-stone-500 font-medium">My Decks</div>
        <a
          href="/"
          className="text-[13.5px] text-stone-500 hover:text-stone-900 transition-colors"
        >
          ← Home
        </a>
      </nav>

      <div className="lg:px-8 max-w-7xl mx-auto  pt-12 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1
              className="text-[clamp(32px,5vw,48px)] font-normal text-stone-900 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              My Decks
            </h1>
            <p className="text-[15px] text-stone-500 mt-2">
              Manage and continue studying your personal decks
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <DeckFilter deckFilterHandlers={deckFilterHandlers} />
            <CreateDeckDialog />
          </div>
        </div>

        {/* Decks Container - Empty Placeholder */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-[15px] font-medium text-stone-700">
              Your Decks
            </div>
          </div>

          {/* Empty Deck Grid Container */}
          <div className="space-y-2">
            {decks &&
              decks.length > 0 &&
              decks.map((d) => (
                <DeckPreviewCard key={`${d.topic}.${d.id}`} deck={d} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDecks;
