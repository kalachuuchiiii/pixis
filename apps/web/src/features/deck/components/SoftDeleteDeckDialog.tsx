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

export const SoftDeleteDeckDialog = ({ deckId }:{ deckId: number }) => {
  const { isSoftDeletingDeck, softDeleteDeck } = useDeck();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"destructive"} className=" my-btn">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Deck</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this deck? This will be moved to your archived and can still be recovered anytime
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled = {isSoftDeletingDeck} onClick={() => softDeleteDeck({ deckId })}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
