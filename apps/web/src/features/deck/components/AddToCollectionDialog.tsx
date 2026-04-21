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
import { useMyCollections } from "@/features/collection/hooks/useMyCollections";
import {  Plus } from "lucide-react";
import { useCollectionDeck } from "@/features/collection/hooks/useCollectionDeck";

export const AddToCollectionDialog = ({
  deckId,
}: {
  deckId: number | string;
}) => {
  const { collectionFilterHandlers, collections, ref } = useMyCollections();
  const { addDeckToCollection, isAddingDeckToCollection } = useCollectionDeck();
  return (
    <Sheet>
      <SheetTrigger>
        <Button className="my-btn " variant={"outline"}>
          <Plus /> Add to Collection
        </Button>
      </SheetTrigger>
      <SheetContent className="px=">
        <SheetHeader>
          <h1 className="heading text-4xl ">Add to collection</h1>
          <p className="description">
            Which collection you want this deck to add?
          </p>
        </SheetHeader>
        <div className="p-2 space-y-10">
          <header>
            <CollectionFilter collectionFilter={collectionFilterHandlers} />
          </header>
          <main className="overflow-y-scroll px-5 h-[65vh] flex items- flex-col gap-1">
            {collections.map((c) => (
              <CollectionCard.Root collection={c}>
                <CollectionCard.Title />
                <CollectionCard.DeckCount />
                <SheetClose asChild>
                  <Button
                    disabled={isAddingDeckToCollection}
                    onClick={() =>
                      addDeckToCollection({ collectionId: c.id, deckId })
                    }
                    variant={"secondary"}
                  >
                    <Plus />
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
