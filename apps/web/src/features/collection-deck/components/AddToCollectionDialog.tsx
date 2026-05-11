import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
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
      <SheetContent className="px=">
        <SheetHeader>
          <div className="my-4 mb-10">
            <h1 className="heading text-3xl lg:text-4xl ">Add to collection</h1>
            <p className="description">
              Which collection you want this deck to add?
            </p>
          </div>
          <header>
            <CollectionFilter collectionFilter={collectionFilterHandlers} />
          </header>
        </SheetHeader>

        <div className="p-2 space-y-10">
          <main className="overflow-y-scroll rounded-xl border-1 p-2 h-[65vh] flex items- flex-col gap-1">
            {collections.map((c) => (
              <CollectionCard collection={c}>
                <CollectionCard.Header />
                <CollectionCard.Title />
                <CollectionCard.DeckCount />
                <CollectionCard.Author />
                <SheetClose asChild>
                  <Button
                    disabled={isAddingDeckToCollection}
                    className="my-btn m-2"
                    onClick={() =>
                      addDeckToCollection({ collectionId: c.id, deckId })
                    }
                    variant={"secondary"}
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
