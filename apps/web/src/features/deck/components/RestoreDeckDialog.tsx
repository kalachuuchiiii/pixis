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
import { CloudBackup, Trash } from "lucide-react";
import { useDeck } from "../hooks/useDeck";
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
      <AlertDialogTrigger asChild>
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

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isRestoringDeck}
            onClick={() => restoreDeck(deckId)}
          >
            Restore
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
