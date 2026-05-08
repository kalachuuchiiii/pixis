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
import { useForm } from "react-hook-form";
import { CollectionForm } from "../components/CollectionForm";
import { useCollection } from "../hooks/useCollection";
import { CollectionCard } from "../components/CollectionCard";
import { useCollections } from "../hooks/useCollections";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import clsx from "clsx";

const MyCollections = () => {
  const { data: user } = useProfileDetails();
  const collectionForm = useForm<CF>({
    defaultValues: {
      visibility: "private",
      name: `${user.nickname || user.username}'s Collection`,
      color: "#000000",
    },
  });
  const collectionValues = collectionForm.watch();
  const { createCollection, isCreatingCollection } = useCollection();

  const collectionTriggerRef = useRef<HTMLButtonElement | null>(null);

  const {
    collectionFilterHandlers,
    infiniteCollectionQuery: { hasNextPage, isPending, isFetching },
    collections,
    ref,
  } = useCollections();

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
            <CollectionFilter
              menus={[
                <Link to={"/app/saved-collections"} className="w-full">
                  <Button className="my-btn w-full" variant={"ghost"}>
                    Save
                  </Button>
                </Link>,
                <Dialog>
                  <DialogTrigger asChild ref={collectionTriggerRef}>
                    <Button className="my-btn">
                      <Plus /> Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={`pl-0 py-0 flex rounded-xl overflow-hidden  min-w-5/12`}
                  >
                    <div
                      className={`border-l-8 shadow-[0px_0px_16px] shadow-[${collectionValues.color}] border-l-[${collectionValues.color}]`}
                    />
                    <CollectionForm
                      className="space-y-4 p-4"
                      collectionFormHandlers={collectionForm}
                      header={
                        <header>
                          <h1 className="heading text-4xl">
                            Create collection
                          </h1>
                          <p className="description">
                            Group your decks in one place!
                          </p>
                        </header>
                      }
                      footer={
                        <footer className="flex items-center justify-end gap-1">
                          <DialogClose>
                            <Button className="my-btn" variant={"secondary"}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <DialogClose>
                            <Button
                              type="button"
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
                </Dialog>,
              ]}
              collectionFilter={collectionFilterHandlers}
            />
          </div>
        }
      />
      <main className="grid lg:grid-cols-3 grid-cols-1 gap-4">
        {collections.map((c, i) => (
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
              content={
                <Button
                  className="my-btn"
                  onClick={() => collectionTriggerRef.current?.click()}
                >
                  <Plus /> Create
                </Button>
              }
            />
          )
        )}
      </div>
      <div ref={ref} />
    </div>
  );
};

export default MyCollections;
