import api from "@/lib/api";
import {
  type Collection,
  type CollectionForm as CF,
  collectionFormSchema,
} from "@pixis/schemas";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import { AppHeader } from "@/components/ui/AppHeader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useAppSelector } from "@/hooks/useReduxHook";
import { useForm } from "react-hook-form";
import { CollectionForm } from "../components/CollectionForm";
import { useMyCollection } from "../hooks/useMyCollection";
import { DeckDisplay } from "@/features/deck/components/DeckDisplay";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CollectionDetails = () => {
  const { collectionId = 0 } = useParams();
  const { user } = useAppSelector((state) => state.profile);
  const collectionForm = useForm<CF>({
    defaultValues: {
      name: "",
      color: "#000000",
      visibility: "private",
    },
  });
  const {
    updateCollection,
    isUpdatingCollection,
    deleteCollection,
    isDeletingCollection,
  } = useMyCollection();

  const {
    data: collection,
    isPending,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      const res = await api.get<{ collection: Collection }>(
        `/collections/${collectionId}`
      );
      const cleanCollection = collectionFormSchema.parse(res.data.collection);
      console.log(cleanCollection);
      collectionForm.reset(cleanCollection);
      return res.data.collection;
    },
    queryKey: ["collection", collectionId],
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: decks,
    isPending: isPendingDecks,
    isFetching: isFetchingDecks,
    hasNextPage,
  } = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const result = await api.get(
        `/collection-deck/${collectionId}/?page=${pageParam}&limit=${6}`
      );
      return result.data;
    },
    queryKey: ["collections", collectionId],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
    enabled: !!collection,
  });

  const collectionDecks = decks?.pages.flatMap((p) => p.decks) ?? [];
  const values = collectionForm.watch();

  if (!collection || isPending || isFetching) {
    return <LoadingDisplay />;
  }

  return (
    <div className={`page-container animate-fade-in-right rounded-2xl`}>
      <AppHeader
        heading={`${collection.name}`}
        description={`${collection.deckCount} Deck(s)`}
        beside={
          user.id === collection.userId && (
            <div className="w-full text-right">
              <Dialog>
                <DialogTrigger>
                  <Button variant={"outline"} className="my-btn">
                    <Pencil />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`min-w-5/12 rounded-xl space-y-10  p-6 border-l-8 border-l-[${values.color}]`}
                >
                  <CollectionForm
                    className="flex flex-col items-start h-full justify-between"
                    header={
                      <header>
                        <h1 className="heading text-4xl">
                          Update {collection.name}
                        </h1>
                        <p className="description">Update your collection</p>
                      </header>
                    }
                    footer={
                      <footer className="flex items-center w-full justify-end gap-1">
                        <DialogClose>
                          <Button className="my-btn" variant={"ghost"}>
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={() => collectionForm.reset()}
                          className="my-btn"
                          variant={"outline"}
                        >
                          Reset Changes
                        </Button>
                        <DialogClose>
                          <Button
                            disabled={isUpdatingCollection}
                            onClick={() =>
                              updateCollection({
                                collectionId,
                                collectionForm: values,
                              })
                            }
                            className="my-btn"
                          >
                            Update
                          </Button>
                        </DialogClose>
                      </footer>
                    }
                    collectionFormHandlers={collectionForm}
                  />
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant={"destructive"} className="my-btn">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete collection?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This cannot be undone
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center justify-end gap=1">
                    <AlertDialogCancel variant={"outline"}>
                      No, keep it
                    </AlertDialogCancel>
                    <AlertDialogCancel
                      disabled={isDeletingCollection}
                      onClick={() =>
                        deleteCollection({ collectionId: collection.id })
                      }
                      variant={"destructive"}
                    >
                      Yes, Delete
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        }
      />
      <main className="grid grid-cols-2 gap-1">
        {collectionDecks?.map((d) => (
          <DeckDisplay.Default key={d.id} deck={d} />
        ))}
      </main>
      <div>
        {isFetchingDecks || isPendingDecks ? (
          <Spinner />
        ) : !hasNextPage && collectionDecks?.length > 0 ? (
          <EmptyResource
            title="No more collections"
            description="No more collections to show"
          />
        ) : (
          !hasNextPage && (
            <EmptyResource
              title="No decks"
              description="No decks in here yet. Start by adding one"
              content={
                <div>
                  <Link to={'/app/decks'}>
                    <Button>My decks</Button></Link>
                </div>
              }
            />
          )
        )}
      </div>
    </div>
  );
};

export default CollectionDetails;
