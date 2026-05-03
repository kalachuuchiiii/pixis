import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import { Spinner } from "@/components/ui/spinner";
import { FlashcardCreator } from "@/features/flashcard/components/FlashcardCreator";
import { FlashcardFilter } from "@/features/flashcard/components/FlashcardFilter";
import { FlashcardPreviewCard } from "@/features/flashcard/components/ui/FlashcardPreviewCard";
import { useDeckFlashcards } from "@/features/flashcard/hooks/useDeckFlashcards";
import { Plus } from "lucide-react";
import { useDeckDetails } from "../hooks/useDeckDetails";
import { StartAndSelectExamMode } from "@/features/exam/components/StartAndSelectExamMode.tsx";

const DeckFlashcards = () => {
  const { data: deck, isPending } = useDeckDetails();

  const {
    flashcards,
    flashcardFilter,
    hasNextPage,
    ref,
    isFetching: isDeckFlashcardsFetching,
    isPending: isDeckFlashcardsPending,
    createDeckFlashcardTriggerRef,
  } = useDeckFlashcards();

  if (isPending || !deck) {
    return <LoadingDisplay />;
  }

  return (
    <>
      <main>
        <header className="flex items-center gap-20">
          <div className="flex w-full gap-3 justify-end h-11">
            <FlashcardFilter flashcardFilter={flashcardFilter} />
            <Dialog>
              <DialogTrigger ref={createDeckFlashcardTriggerRef}>
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

        <main className="grid grid-cols-3  mt-10 gap-4 ">
          {flashcards.map((f) => (
            <FlashcardPreviewCard color={deck.color} flashcard={f} key={f.id} />
          ))}
        </main>
        <footer className="mt-20">
          {isDeckFlashcardsFetching || isDeckFlashcardsPending ? (
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
    </>
  );
};

export default DeckFlashcards;
