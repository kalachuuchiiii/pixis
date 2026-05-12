import { EmptyResource } from "@/components/ui/EmptyResource";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import { Spinner } from "@/components/ui/spinner";
import { FlashcardFilter } from "@/features/flashcard/components/FlashcardFilter";
import { FlashcardCard } from "@/features/flashcard/components/ui/FlashcardCard";
import { useDeckFlashcards } from "@/features/flashcard/hooks/useDeckFlashcards";
import { useDeckDetails } from "../hooks/useDeckDetails";
import { Switch } from "@/components/ui/switch";

const DeckFlashcards = () => {
  const { data: deck, isPending } = useDeckDetails();

  const {
    flashcards,
    flashcardFilter,
    hasNextPage,
    ref,
    isFetching: isDeckFlashcardsFetching,
    isPending: isDeckFlashcardsPending,
    showAllAnswer,
    toggleShowAllAnswer,
  } = useDeckFlashcards();

  if (isPending || !deck) {
    return <LoadingDisplay />;
  }

  return (
    <div>
      <main>
        <header className="flex items-center gap-20">
          <div className="flex w-full gap-3 justify-end h-8 lg:h-12">
            <FlashcardFilter deck={deck} flashcardFilter={flashcardFilter} />
          </div>
        </header>
        <div className=" mt-15 mb-5 lg:my-5 flex items-center lg:gap-4 lg:justify-start justify-between ">
          Show all answers immediately{" "}
          <Switch
            checked={showAllAnswer}
            onCheckedChange={toggleShowAllAnswer}
          />
        </div>
        <main className="grid grid-cols-1 lg:grid-cols-3   gap-4 ">
          {flashcards.map((f) => (
            <FlashcardCard
              showAnswerImmediately={showAllAnswer}
              color={deck.color}
              flashcard={f}
              key={f.id}
            />
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
    </div>
  );
};

export default DeckFlashcards;
