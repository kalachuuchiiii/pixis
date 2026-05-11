import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { CloudBackup } from "lucide-react";
import { useArchive } from "../hooks/useArchive";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const RestoreDeckDialog = ({ deckId }: { deckId: number }) => {
  const { restoreDeck, isRestoringDeck } = useArchive();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <Button variant={"outline"} className="my-btn">
              <CloudBackup />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Restore deck</TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore Deck</AlertDialogTitle>
          <AlertDialogDescription>Restore this deck?</AlertDialogDescription>
        </AlertDialogHeader>

        <main className="flex items-center justify-end gap-2 ">
          <AlertDialogCancel variant={"outline"} className="my-btn">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={"default"}
            className="my-btn"
            disabled={isRestoringDeck}
            onClick={() => restoreDeck(deckId)}
          >
            Restore
          </AlertDialogAction>
        </main>
      </AlertDialogContent>
    </AlertDialog>
  );
};
