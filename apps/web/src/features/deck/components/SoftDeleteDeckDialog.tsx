import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useDeck } from "../hooks/useDeck";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SoftDeleteDeckDialog = ({ deckId }: { deckId: number }) => {
  const { isSoftDeletingDeck, softDeleteDeck } = useDeck();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <Button variant={"destructive"} className=" my-btn">
              <Trash />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Soft delete deck</TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Deck</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this deck? This will be moved to
            your archived and can still be recovered anytime
          </AlertDialogDescription>
        </AlertDialogHeader>

        <footer className="flex items-center gap-2 justify-end">
          <AlertDialogCancel variant={"outline"} className="my-btn">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={"destructive"}
            className="my-btn"
            disabled={isSoftDeletingDeck}
            onClick={() => softDeleteDeck({ deckId })}
          >
            Remove
          </AlertDialogAction>
        </footer>
      </AlertDialogContent>
    </AlertDialog>
  );
};
