import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { CollectionForm } from "./CollectionForm";
import { useCollection } from "../hooks/useCollection";
import type { UseFormReturn } from "react-hook-form";
import type { Collection } from "@pixis/schemas";
import { memo } from "react";
import type { Visibility } from "@pixis/constants";

type CF = UseFormReturn<
  {
    name: string;
    visibility: Visibility;
    color: string;
  },
  any,
  {
    name: string;
    visibility: Visibility;
    color: string;
  }
>;

export const UpdateCollectionDialog = ({
  collectionForm,
  collection,
}: {
  collectionForm: CF;
  collection: Collection;
}) => {
  const { updateCollection, isUpdatingCollection } = useCollection();
  const { watch } = collectionForm;
  const color = watch("color");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="my-btn  w-full">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`min-w-5/12 rounded-xl space-y-10  p-8 border-l-8 border-l-[${color}]`}
      >
        <CollectionForm
          className="flex flex-col items-start h-full justify-between"
          header={
            <header>
              <h1 className="heading text-3xl lg:text-4xl ">
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
                      collectionId: collection.id,
                      collectionForm: collectionForm.getValues(),
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
  );
};
