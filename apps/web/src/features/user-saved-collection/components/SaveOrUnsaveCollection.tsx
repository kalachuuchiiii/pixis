import { Button } from "@/components/ui/button";
import type { Collection } from "@pixis/schemas";
import { Bookmark } from "lucide-react";
import React from "react";
import { useUserSavedCollection } from "../hooks/useUserSavedCollection";

export const SaveOrUnsaveCollection = ({
  collection,
}: {
  collection: Collection;
}) => {
  const {
    saveCollection,
    isSavingCollection,
    unsaveCollection,
    isUnsavingCollection,
  } = useUserSavedCollection();

  return (
    <>
      {!collection.userSavedCollection?.id ? (
        <Button
          disabled={isSavingCollection}
          onClick={() => saveCollection({ collectionId: collection.id })}
          className="my-btn w-full"
          variant={"ghost"}
        >
          <Bookmark /> Save
        </Button>
      ) : (
        <Button
          disabled={isUnsavingCollection}
          onClick={() => unsaveCollection({ collectionId: collection.id })}
          className="my-btn"
          variant={"outline"}
        >
          <Bookmark className="text-yellow-500" /> Unsave
        </Button>
      )}
    </>
  );
};
