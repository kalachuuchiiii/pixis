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
import { useArchive } from "../hooks/useArchive";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const DeleteDeckDialog = ({ deckId }: { deckId: number }) => {
  const { deleteDeck, isDeletingDeck } = useArchive();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <Button variant={"destructive"} className="my-btn">
              <Trash />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete permanently</TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Deck</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this deck? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>

        <main className="flex items-center justify-end gap-2">
          <AlertDialogCancel variant={"outline"} className="my-btn">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={"destructive"}
            className="my-btn"
            disabled={isDeletingDeck}
            onClick={() => deleteDeck(deckId)}
          >
            Delete
          </AlertDialogAction>
        </main>
      </AlertDialogContent>
    </AlertDialog>
  );
};
