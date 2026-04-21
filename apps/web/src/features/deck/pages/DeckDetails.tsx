import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import api from "@/lib/api";
import type { Deck, DeckWithAuthor } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { DeckDisplay } from "../components/DeckDisplay";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudBackup, Pencil, Plus, Trash } from "lucide-react";
import { useAppSelector } from "@/hooks/useReduxHook";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteDeckDialog } from "../components/DeleteDeckDialog";
import { SoftDeleteDeckDialog } from "../components/SoftDeleteDeckDialog";
import { RestoreDeckDialog } from "../components/RestoreDeckDialog";
import { UpdateDeckDialog } from "../components/UpdateDeckDialog";
import FlashcardList from "@/features/flashcard/pages/FlashcardList";
import { useFlashcardList } from "@/features/flashcard/hooks/useFlashcardList";
import { AppHeader } from "@/components/ui/AppHeader";
import { FlashcardFilter } from "@/features/flashcard/components/FlashcardFilter";
import { FlashcardCreator } from "@/features/flashcard/components/FlashcardCreator";
import {
  CloseEndedFlashcard,
  OpenEndedFlashcard,
} from "@/features/flashcard/components/MyFlashcard";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { Spinner } from "@/components/ui/spinner";
import { FlashcardPreviewCard } from "@/features/flashcard/components/ui/FlashcardPreviewCard";
import { AddToCollectionDialog } from "../components/AddToCollectionDialog";

const DeckDetails = () => {
  const { deckId = '' } = useParams();
  const { user } = useAppSelector((state) => state.profile);
  const {
    flashcards,
    totalFlashcards,
    isProcessing,
    flashcardFilterHandlers,
    hasNextPage,
    ref,
    createFlashcardTriggerRef,
  } = useFlashcardList();

  const {
    data: deck,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: async () => {
      const res = await api.get<{ deck: Deck }>(`/decks/${deckId}`);
      return res.data.deck;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isPending || isFetching || !deck) {
    return <LoadingDisplay />;
  }

  return (
    <div
      className={`page-container border-l-8 rounded-l-xl border-l-[${deck.color}] space-y-12 animate-fade-in-right`}
    >
      <header className="flex items-center justify-between">
        <DeckDisplay deck={deck}>
          <DeckDisplay.Header />
          <DeckDisplay.Title textSize={24} />
        </DeckDisplay>
        {user.id === deck.userId && (
          <div className="flex items-center gap-2">
            <AddToCollectionDialog deckId={deckId} />
            <UpdateDeckDialog deck={deck} />
            {deck.deletedAt !== null ? (
              <>
                <RestoreDeckDialog deckId={Number(deckId || 0)} />
                <DeleteDeckDialog deckId={Number(deckId || 0)} />
              </>
            ) : (
              <SoftDeleteDeckDialog deckId={Number(deckId || 0)} />
            )}
          </div>
        )}
      </header>
      <main>
        <header className="flex items-center gap-20">
          <div>
            <h1 className="heading">Flashcards</h1>
            <p className="description">{totalFlashcards} / 200</p>
          </div>
          <div className="flex w-full gap-3 justify-end h-11">
            <FlashcardFilter
              flashcardFilter={flashcardFilterHandlers}
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
        </header>

        <main className="grid grid-cols-3 mt-10 gap-2 place-content-center ">
          {flashcards.map((f) => (
            <FlashcardPreviewCard data={f} />
          ))}
        </main>
        <footer className="mt-20">
          {isProcessing ? (
            <Spinner />
          ) : !hasNextPage && flashcards.length > 0 ? (
            <EmptyResource
              title="No more flashcards"
              description="No more flashcards to show"
              content={
                <Button
                  onClick={() => createFlashcardTriggerRef.current?.click()}
                  className="my-btn"
                >
                  <Plus /> Create
                </Button>
              }
            />
          ) : (
            !hasNextPage && (
              <EmptyResource
                title="No flashcards yet"
                description="No flashcards yet. Start by creating one"
                content={
                  <Button
                    onClick={() => createFlashcardTriggerRef.current?.click()}
                    className="my-btn"
                  >
                    <Plus /> Create
                  </Button>
                }
              />
            )
          )}
        </footer>
        <div ref={ref} />
      </main>
    </div>
  );
};

export default DeckDetails;
