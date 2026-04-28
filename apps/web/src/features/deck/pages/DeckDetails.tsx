import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import api from "@/lib/api";
import type { Deck } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { DeckDisplay } from "../components/DeckDisplay";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { DeleteDeckDialog } from "../components/DeleteDeckDialog";
import { SoftDeleteDeckDialog } from "../components/SoftDeleteDeckDialog";
import { RestoreDeckDialog } from "../components/RestoreDeckDialog";
import { UpdateDeckDialog } from "../components/UpdateDeckDialog";
import { useFlashcardList } from "@/features/flashcard/hooks/useFlashcardList";
import { FlashcardFilter } from "@/features/flashcard/components/FlashcardFilter";
import { FlashcardCreator } from "@/features/flashcard/components/FlashcardCreator";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { Spinner } from "@/components/ui/spinner";
import { FlashcardPreviewCard } from "@/features/flashcard/components/ui/FlashcardPreviewCard";
import { AddToCollectionDialog } from "../../collection-deck/components/AddToCollectionDialog";
import { SaveOrUnsaveDeckButton } from "@/features/user-saved-deck/components/SaveOrUnsaveDeckButton";
import { SelectExamModeDialog } from "@/features/exam/components/SelectExamModeDialog";

const DeckDetails = () => {
  const { deckId = "" } = useParams();
  const { user } = useAppSelector((state) => state.profile);
  const {
    flashcards,
    totalFlashcards,
    infiniteFlashcardQuery,
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
      console.log(res);
      return res.data.deck;
    },
  });

  if (isPending || !deck) {
    return <LoadingDisplay />;
  }

  return (
    <>
      <div
        className={`page-container border-l-20 rounded-l-xl border-l-[${deck.color}] space-y-12 animate-fade-in-right`}
      >
        <header className="flex items-end justify-between">
          <DeckDisplay deck={deck}>
            <DeckDisplay.Header />
            <DeckDisplay.Title />
          </DeckDisplay>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <AddToCollectionDialog deckId={deckId} />
              <SaveOrUnsaveDeckButton deck={deck} />
            </div>
            {user.id === deck.userId && (
              <div className="flex items-center gap-2">
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
          </div>
        </header>
        <main>
          <header className="flex items-center gap-20">
            <div className="flex w-full gap-3 justify-end h-11">
              <FlashcardFilter flashcardFilter={flashcardFilterHandlers} />
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

          <main className="grid grid-cols-3     mt-10 gap-2 place-content-center ">
            {flashcards.map((f) => (
              <FlashcardPreviewCard
                color={deck.color}
                flashcard={f}
                key={f.id}
              />
            ))}
          </main>
          <footer className="mt-20">
            {infiniteFlashcardQuery.isFetching ||
            infiniteFlashcardQuery.isPending ? (
              <Spinner />
            ) : !hasNextPage && flashcards.length > 0 ? (
              <EmptyResource
                title="No more flashcards"
                description="No more flashcards to show"
              />
            ) : (
              !hasNextPage && (
                <EmptyResource
                  title="No flashcards yet"
                  description="No flashcards yet"
                />
              )
            )}
          </footer>

          <div ref={ref} />
        </main>
      </div>

      <SelectExamModeDialog deckId={deck.id} />
    </>
  );
};

export default DeckDetails;
