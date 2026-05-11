import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import type { CollectionForm as CF } from "@pixis/schemas";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { CollectionForm } from "./CollectionForm";
import { useCollection } from "../hooks/useCollection";

export const CollectionCreatorDialog = ({
  ...props
}: ComponentProps<"button">) => {
  const { data: user } = useAuthUser();
  const { createCollection, isCreatingCollection } = useCollection();
  const collectionForm = useForm<CF>({
    defaultValues: {
      visibility: "private",
      name: `${user.nickname || user.username}'s Collection`,
      color: "#000000",
    },
  });
  const collectionValues = collectionForm.watch();

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild {...props}>
            <Button className="my-btn">
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create collection</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent
        className={`pl-0 py-0 pr-6 flex rounded-xl overflow-hidden  min-w-5/12`}
      >
        <div
          className={`border-l-8  shadow-[0px_0px_16px] shadow-[${collectionValues.color}] border-l-[${collectionValues.color}]`}
        />
        <CollectionForm
          className="space-y-4 p-6 "
          collectionFormHandlers={collectionForm}
          header={
            <header>
              <h1 className="heading text-4xl">Create collection</h1>
              <p className="description">Group your decks in one place!</p>
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
    </Dialog>
  );
};
