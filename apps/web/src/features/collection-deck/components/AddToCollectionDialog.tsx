import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CollectionCard } from "@/features/collection/components/CollectionCard";
import { CollectionFilter } from "@/features/collection/components/CollectionFilter";
import { useCollections } from "@/features/collection/hooks/useCollections";
import { Plus } from "lucide-react";
import { useCollectionDeck } from "@/features/collection-deck/hooks/useCollectionDeck";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";

export const AddToCollectionDialog = ({
  deckId,
}: {
  deckId: number | string;
}) => {
  const {
    collectionFilterHandlers,
    collections,
    ref,
    hasNoData,
    hasNoMoreData,
    isPending,
    isFetching,
  } = useCollections();

  const { addDeckToCollection, isAddingDeckToCollection } = useCollectionDeck();

  return (
    <Sheet>
      <SheetTrigger>
        <Tooltip>
          <TooltipTrigger>
            <Button className="my-btn " variant={"outline"}>
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add to collection</TooltipContent>
        </Tooltip>
      </SheetTrigger>
      <SheetContent className="sheet-container w-full">
        <div className="w-full">
          <SheetHeader>
            <SheetTitle className="lg:text-4xl text-3xl heading">
              Which collection you want this deck to add?
            </SheetTitle>
          </SheetHeader>
          <header className="w-full">
            <CollectionFilter collectionFilter={collectionFilterHandlers} />
          </header>
        </div>
        <div className="lg:p-2 space-y-10">
          <main className="overflow-y-scroll rounded-xl border-1  lg:p-2 h-[65vh] flex items- flex-col gap-1">
            {collections.map((c) => (
              <CollectionCard collection={c}>
                <CollectionCard.Header />
                <CollectionCard.Title />
                <CollectionCard.DeckCount />

                <SheetClose asChild>
                  <Button
                    disabled={isAddingDeckToCollection}
                    className="my-btn m-2"
                    onClick={() =>
                      addDeckToCollection({ collectionId: c.id, deckId })
                    }
                  >
                    Add here <Plus />
                  </Button>
                </SheetClose>
              </CollectionCard>
            ))}
            <div className="my-20">
              {isPending && isFetching ? (
                <Spinner />
              ) : hasNoData ? (
                <EmptyResource title="No collections yet" description=":)" />
              ) : (
                hasNoMoreData && (
                  <EmptyResource
                    title="You've reached the last page"
                    description="No more collections"
                  />
                )
              )}
            </div>
            <div ref={ref} />
          </main>
        </div>
      </SheetContent>
    </Sheet>
  );
};
