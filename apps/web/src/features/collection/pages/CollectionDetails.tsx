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
import { Bookmark, Pencil, Trash } from "lucide-react";
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
import { UpdateCollectionDialog } from "../components/UpdateCollectionDialog";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { DeckFilter } from "@/features/deck/components/DeckFilter";
import { useDeckFilter } from "@/features/deck/hooks/useDeckFilter";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import { useUserSavedCollection } from "@/features/user-saved-collection/hooks/useUserSavedCollection";
import { SaveOrUnsaveCollection } from "@/features/user-saved-collection/components/SaveOrUnsaveCollection";

const CollectionDetails = () => {
  const { collectionId = 0 } = useParams();
  const { user } = useAppSelector((state) => state.profile);
  const deckFilter = useDeckFilter();
  const { query } = deckFilter;
  const { saveCollection, isSavingCollection } = useUserSavedCollection();

  const collectionForm = useForm<CF>({
    defaultValues: {
      name: "",
      color: "#000000",
      visibility: "private",
    },
  });

  const { deleteCollection, isDeletingCollection } = useMyCollection();

  const { data: collection, isPending } = useQuery({
    queryFn: async () => {
      const res = await api.get<{ collection: Collection }>(
        `/collections/${collectionId}`
      );
      const cleanCollection = collectionFormSchema.parse(res.data.collection);
      collectionForm.reset(cleanCollection);
      return res.data.collection;
    },
    queryKey: ["collection", collectionId],
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
  });

  const infiniteCollectionDeckQuery = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      const result = await api.get(
        `/collection-deck/${collectionId}/?page=${pageParam}&limit=${6}&${query}`
      );
      return result.data;
    },
    queryKey: ["collections", collectionId, query],
    initialPageParam: 1,
    getNextPageParam: (prev) => prev.nextPage,
    enabled: !!collection,
  });
  const {
    data: decks,
    isPending: isPendingDecks,
    isFetching: isFetchingDecks,
    hasNextPage,
  } = infiniteCollectionDeckQuery;
  const { ref } = useInViewRefetch(infiniteCollectionDeckQuery);
  const collectionDecks = decks?.pages.flatMap((p) => p.decks) ?? [];

  if (!collection || isPending) {
    return <LoadingDisplay />;
  }

  return (
    <div className={`page-container animate-fade-in-right rounded-2xl`}>
      <AppHeader
        subheading={`${collection.user.username}'s collection`}
        heading={`${collection.name}`}
        description={`${collection.deckCount} Deck(s)`}
        beside={
          user.id === collection.userId && (
            <div className="w-full text-right flex items-end justify-end gap-2">
              <DeckFilter deckFilter={deckFilter} />
              <SaveOrUnsaveCollection collection={collection} />
              <UpdateCollectionDialog
                collection={collection}
                collectionForm={collectionForm}
              />

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
      <main className="grid grid-cols-3 gap-4">
        {collectionDecks?.map((d) => (
          <DeckDisplay.Default key={d.id} deck={d} />
        ))}
      </main>
      <div className="my-20">
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
              description="No decks in here yet"
            
            />
          )
        )}
      </div>
      <div ref={ref} />
    </div>
  );
};

export default CollectionDetails;
