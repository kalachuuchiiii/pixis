import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { VISIBILITY_OPTIONS } from "../data/visibilityOptions";
import { Input } from "@/components/ui/input";
import { useDeckManager } from "../hooks/useDeckManager";
import { DESCRIPTION_MAX, TITLE_MAX } from "@pixis/constants";
import { Textarea } from "@/components/ui/textarea";
import { QUICK_TOPICS } from "../data/quickTopics";
import { ChevronRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateFlashcard } from "@/features/flashcard/components/CreateFlashcard";
import { DeckManagerContext } from "@/features/flashcard/hooks/useDeckManagerContext";



const DeckManager = () => {
  const deckManager = useDeckManager();
  const { deck, handleChangeDeckForm, handleChangeVisibility, addTopic } =
    deckManager;
    const { deckId = 0 } = useParams();

  if (!deck) {
    return <div>Loading...</div>;
  }

  return (
    <DeckManagerContext.Provider value={deckManager}>
      <div>
        <header className="mb-8">
          <h1 className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-2">
            Your deck
          </h1>
          <h1
            className="text-[28px] font-normal text-stone-900 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Manage your deck
          </h1>
          <p className="text-[14px] text-stone-400 mt-1.5">
            Update your existing deck
          </p>
        </header>

        <div className="space-y-6">
          {/* Title */}
          <div className="flex gap-2 items-center">
            <Input
              className="w-1/12"
              onChange={handleChangeDeckForm}
              name="color"
              value={deck.color}
              type="color"
            />

            <Input
              name="title"
              value={deck.title}
              onChange={handleChangeDeckForm}
              placeholder="Title e.g. Cell Biology — Chapter 3"
              maxLength={TITLE_MAX}
              className="h-[42px] rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {/* Description */}
          <div>
            <Textarea
              name="description"
              value={deck.description}
              onChange={handleChangeDeckForm}
              placeholder="What's this deck about? (optional)"
              maxLength={DESCRIPTION_MAX}
              rows={3}
              className="rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors resize-none leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {/* Topic */}
          <div>
            <Input
              name="topic"
              value={deck.topic}
              onChange={handleChangeDeckForm}
              placeholder="e.g. Biology"
              className="h-[42px] rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />

            {/* Quick topic buttons */}
            <div className="w-full flex mt-3 items-center gap-2">
              <div className=" flex flex-wrap gap-2">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => addTopic(topic)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 active:bg-stone-100 transition-colors text-stone-700"
                  >
                    <Tag size={13} strokeWidth={2.5} />
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <div className="grid grid-cols-3 gap-2.5">
              {VISIBILITY_OPTIONS.map((opt) => {
                const active = deck.visibility === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChangeVisibility(opt.value)}
                    className={`flex flex-col items-start gap-2 px-4 py-3.5 rounded-xl border text-left transition-all ${
                      active
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <span className={active ? "text-white" : "text-stone-400"}>
                      {opt.icon}
                    </span>
                    <div>
                      <p
                        className={`text-[13px] font-semibold leading-tight ${active ? "text-white" : "text-stone-800"}`}
                      >
                        {opt.label}
                      </p>
                      <p
                        className={`text-[11.5px] mt-0.5 leading-snug ${active ? "text-stone-300" : "text-stone-400"}`}
                      >
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}

          <div className="flex w-full items-center gap-3 pt-2">
             <Link to={`/app/decks/${deckId}/manage/flashcard`}>
             <Button variant={'outline'} className="my-btn w-2/12">
              Flashcards <ChevronRight />
            </Button>
             </Link>
            <Button  type="button" className="my-btn w-10/12">
              Save deck
            </Button>
          </div>
        </div>
      </div>
    </DeckManagerContext.Provider>
  );
};

{
  /* Save */
}

export default DeckManager;
