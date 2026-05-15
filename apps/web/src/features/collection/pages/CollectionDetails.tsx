import { type CollectionForm as CF } from "@pixis/schemas";
import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Bookmark, Layers, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCollection } from "../hooks/useCollection";
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
import { DeckFilter } from "@/features/deck/components/DeckFilter";
import { SaveOrUnsaveCollection } from "@/features/user-saved-collection/components/SaveOrUnsaveCollection";
import { useCollectionDetails } from "../hooks/useCollectionDetails";
import { useCollectionDecks } from "../hooks/useCollectionDecks";

import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Link } from "react-router-dom";

const CollectionDetails = () => {
  const { data: user } = useAuthUser();

  const collectionForm = useForm<CF>({
    defaultValues: {
      name: "",
      color: "#000000",
      visibility: "private",
    },
  });

  const { deleteCollection, isDeletingCollection } = useCollection();
  const { data: collection, isPending } = useCollectionDetails((c) =>
    collectionForm.reset(c)
  );

  const {
    collectionDecks,
    isPending: isPendingDecks,
    isFetching: isFetchingDecks,
    ref,
    deckFilter,
    hasNextPage,
  } = useCollectionDecks(
    collection?.user?.id === user?.id ? undefined : ["visibility"]
  );

  const hasNoMoreData = !hasNextPage && collectionDecks.length > 0;
  const hasNoData = !hasNextPage && collectionDecks.length === 0;
  const isLoading = isPendingDecks || isFetchingDecks;

  const isMine = user.id === collection?.userId;

  if (!collection || isPending) {
    return <LoadingDisplay />;
  }

  return (
    <div
      className={`page-container animate-fade-in-right space-y-4 rounded-2xl`}
    >
      {<UserBadge.Default user={collection.user} />}
      <Separator className="my-6" />
      <AppHeader
        heading={`${collection.name}`}
        description={`${collection.deckCount} Deck(s)`}
        beside={[
          <div className="w-full text-right flex items-end justify-end gap-2">
            <DeckFilter
              menus={[
                <SaveOrUnsaveCollection collection={collection} />,
                isMine ? (
                  <UpdateCollectionDialog
                    collection={collection}
                    collectionForm={collectionForm}
                  />
                ) : undefined,
                isMine ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant={"destructive"} className="my-btn w-full">
                        <Trash /> Delete
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
                ) : undefined,
              ]}
              deckFilter={deckFilter}
              additionalActions={
                isMine
                  ? [
                      <Link to={`/app/profile/${user.id}/decks`}>
                        <Button className="my-btn" variant="outline">
                          <Layers /> My decks
                        </Button>
                      </Link>,
                      <Link to={`/app/saved-decks`}>
                        <Button variant="outline" className="my-btn">
                          <Bookmark /> Saved decks
                        </Button>
                      </Link>,
                    ]
                  : []
              }
            />
          </div>,
        ]}
      />
      <main className="grid grid-cols-1 lg:grid-cols-3  gap-4">
        {collectionDecks.map((d) => (
          <DeckDisplay.Default key={d?.id} deck={d} />
        ))}
      </main>
      <div className="my-20">
        {isLoading ? (
          <Spinner />
        ) : hasNoMoreData ? (
          <EmptyResource
            title="No more collections"
            description="No more collections to show"
          />
        ) : (
          hasNoData && (
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
