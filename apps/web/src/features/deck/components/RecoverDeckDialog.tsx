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

export const RestoreDeckDialog = ({ deckId }: { deckId: number }) => {
  const { restoreDeck, isRestoringDeck } = useArchive();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className="h-full">
          <CloudBackup />
        </Button>
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
