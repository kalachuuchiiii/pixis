import { AppHeader } from "@/components/ui/AppHeader";
import React, { useRef } from "react";
import { useCollectionFilter } from "../hooks/useCollectionFilter";
import { CollectionFilter } from "../components/CollectionFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Collection, CollectionForm as CF } from "@pixis/schemas";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bookmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useReduxHook";
import { useForm } from "react-hook-form";
import { CollectionForm } from "../components/CollectionForm";
import { useMyCollection } from "../hooks/useMyCollection";
import { CollectionCard } from "../components/CollectionCard";
import { useMyCollections } from "../hooks/useMyCollections";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";

const MyCollections = () => {
  const { user } = useAppSelector((state) => state.profile);
  const collectionForm = useForm<CF>({
    defaultValues: {
      visibility: "private",
      name: `${user.nickname || user.username}'s Collection`,
      color: "#000000",
    },
  });
  const collectionValues = collectionForm.watch();
  const { createCollection, isCreatingCollection } = useMyCollection();

  const collectionTriggerRef = useRef<HTMLButtonElement | null>(null);

  const {
    collectionFilterHandlers,
    infiniteCollectionQuery: { hasNextPage, isPending, isFetching },
    collections,
    ref,
  } = useMyCollections();
  const hasNoMoreData = !hasNextPage && collections.length > 0;
  const hasNoData = !hasNextPage && collections.length === 0;
  const isLoading = isPending || isFetching;

  return (
    <div className="page-container animate-fade-in-right">
      <AppHeader
        heading="My Collections"
        description="Collections of decks"
        beside={
          <div className=" flex items-center gap-2 w-full">
            <CollectionFilter collectionFilter={collectionFilterHandlers} />
            <Tooltip>
              <TooltipTrigger>
                <Link to={"/app/saved-collections"}>
                  <Button className="my-btn" variant={"outline"}>
                    <Bookmark className="text-yellow-500" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Go to your saved collections</TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger ref={collectionTriggerRef}>
                <Button className="my-btn">
                  Create <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`border-l-20 border-l-[${collectionValues.color}] min-w-5/12`}
              >
                <CollectionForm
                  className="space-y-4"
                  collectionFormHandlers={collectionForm}
                  header={
                    <header>
                      <h1 className="heading text-4xl">Create collection</h1>
                      <p className="description">
                        Group your decks in one place!
                      </p>
                    </header>
                  }
                  footer={
                    <footer>
                      <DialogClose>
                        <Button className="my-btn" variant={"secondary"}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <DialogClose>
                        <Button
                          className="my-btn"
                          disabled={isCreatingCollection}
                          onClick={() =>
                            createCollection({
                              collectionForm: collectionForm.watch(),
                            })
                          }
                        >
                          Create
                        </Button>
                      </DialogClose>
                    </footer>
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <main className="grid grid-cols-2 gap-1">
        {collections.map((c) => (
          <Link to={`/app/collections/${c.id}`}>
            <CollectionCard.Default collection={c} />
          </Link>
        ))}
      </main>
      <div className="my-20">
        {isLoading ? (
          <Spinner />
        ) : hasNoMoreData ? (
          <EmptyResource
            title="No more collections"
            description="You've reached the last page"
          />
        ) : (
          hasNoData && (
            <EmptyResource
              title="No collections"
              description="No collections yet"
              content={<Button onClick={() => collectionTriggerRef.current?.click()}>Create</Button>}
            />
          )
        )}
      </div>
      <div ref={ref} />
    </div>
  );
};

export default MyCollections;
