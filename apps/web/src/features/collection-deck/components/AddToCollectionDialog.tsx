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

export const AddToCollectionDialog = ({
  deckId,
}: {
  deckId: number | string;
}) => {
  const { collectionFilterHandlers, collections, ref } = useCollections();
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
          <main className="overflow-y-scroll rounded-xl border-1 p-2 dark:bg-zinc-900 h-[65vh] flex items- flex-col gap-1">
            {collections.map((c) => (
              <CollectionCard.Root collection={c}>
                <CollectionCard.Header />
                <CollectionCard.Title />
                <CollectionCard.DeckCount />
                <SheetClose asChild>
                  <Button
                    disabled={isAddingDeckToCollection}
                    className="my-btn"
                    onClick={() =>
                      addDeckToCollection({ collectionId: c.id, deckId })
                    }
                    variant={"secondary"}
                  >
                    Add here <Plus />
                  </Button>
                </SheetClose>
              </CollectionCard.Root>
            ))}
            <div ref={ref} />
          </main>
        </div>
      </SheetContent>
    </Sheet>
  );
};
