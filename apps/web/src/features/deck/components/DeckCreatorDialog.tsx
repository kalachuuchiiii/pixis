import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { DeckForm } from "./DeckForm";
import { useDeckCreator } from "../hooks/useDeckCreator";
import { Skeleton } from "boneyard-js/react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";

export const DeckCreatorDialog = ({ ...props }: ComponentProps<"button">) => {
  const { deckForm, onSubmit, isCreatingDeck } = useDeckCreator();
  const { data: user } = useAuthUser();
  const { data: profile } = useProfileDetails();

  const isLoading = !user.id && !profile.id;

  return (
    <Dialog>
      <DialogTrigger {...props}>
        <Skeleton loading={isLoading} name="button">
          <Button className="my-btn">
            <Plus /> <span className="hidden lg:block">Create</span>
          </Button>
        </Skeleton>
      </DialogTrigger>
      <DialogContent
        className=" h-[84vh] overflow-y-auto min-w-6/12"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className={`p-6 `}>
          <DeckForm
            deckForm={deckForm}
            header={
              <header className="mb-4">
                <h1 className="heading text-4xl dark:text-zinc-100">
                  Create Deck
                </h1>
                <p className="description text-sm">
                  Fill in the details below, then start adding flashcards.
                </p>
              </header>
            }
            footer={
              <footer className="flex items-center justify-end gap-2">
                <DialogClose>
                  <Button variant={"outline"} className="my-btn">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    disabled={isCreatingDeck}
                    onClick={onSubmit}
                    type="submit"
                    className="w-full my-btn w-10/12"
                  >
                    Save
                  </Button>
                </DialogClose>
              </footer>
            }
          />
          <footer className="mt-4 mb-2"></footer>
        </div>
      </DialogContent>
    </Dialog>
  );
};
