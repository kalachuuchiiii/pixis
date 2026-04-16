import { FlashcardCreator } from "../components/FlashcardCreator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { type Flashcard } from "@pixis/schemas";
import api from "@/lib/api";
import {
  CloseEndedFlashcard,
  OpenEndedFlashcard,
} from "../components/MyFlashcard";

import { FlashcardFilter } from "../components/FlashcardFilter";
import { useFlashcardFilter } from "../hooks/useFlashcardFilter";
import { createContext, useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import { AppHeader } from "@/components/ui/AppHeader";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useFlashcardList } from "../hooks/useFlashcardList";

export const FlashcardListContext = createContext<{
  queryKey: string[];
} | null>(null);

const FlashcardList = () => {
  const {
    flashcards,
    totalFlashcards,
    isProcessing,
    queryKey,
    flashcardFilterHandlers,
    hasNextPage,
    ref,
    createFlashcardTriggerRef,
  } = useFlashcardList();

  return (
    <FlashcardListContext.Provider value={{ queryKey }}>
      <div className="page-container">
        <div className="flex items-end justify-between">
          <AppHeader
            heading={`${totalFlashcards} / 200 Flashcards`}
            description="Flashcards under this deck"
            beside={
              <div className="flex w-full gap-3 justify-end h-11">
                <FlashcardFilter
                  flashcardFilterHandlers={flashcardFilterHandlers}
                />
                <Dialog>
                  <DialogTrigger ref={createFlashcardTriggerRef}>
                    <Button className="my-btn h-full">
                      {" "}
                      <Plus /> New Flashcard
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="min-w-4/10 w-full"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <FlashcardCreator />
                  </DialogContent>
                </Dialog>
              </div>
            }
          />
        </div>

        <main className="grid grid-cols-2 mt-10 gap-2 place-content-center ">
          {flashcards.map((f) =>
            f.type === "open_ended" ? (
              <OpenEndedFlashcard flashcard={f} key={`${f.type}.${f.id}`} />
            ) : (
              <CloseEndedFlashcard flashcard={f} key={`${f.type}.${f.id}`} />
            )
          )}
        </main>

        <footer className="h-40">
          {isProcessing ? (
            <Spinner />
          ) : !hasNextPage && flashcards.length > 0 ? (
            <EmptyResource
              title="No more flashcards"
              description="No more flashcards to show"
              content={<></>}
            />
          ) : (
            !hasNextPage && (
              <EmptyResource
                title="No flashcards yet"
                description="No flashcards yet. Start by creating one"
                content={
                  <Button
                    onClick={() => createFlashcardTriggerRef.current?.click()}
                    className=""
                  >
                    Create
                  </Button>
                }
              />
            )
          )}
        </footer>
        <div ref={ref} />
      </div>
    </FlashcardListContext.Provider>
  );
};

export default FlashcardList;
