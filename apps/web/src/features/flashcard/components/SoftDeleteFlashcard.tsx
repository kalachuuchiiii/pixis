import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMyFlashcard } from "../hooks/useMyFlashcard";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export const SoftDeleteFlashcardDialog = ({ flashcardId, deckId }:{ flashcardId: number | string; deckId: number | string }) => {
  const { isSoftDeletingFlashcard, softDeleteFlashcard } = useMyFlashcard();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"destructive"} className=" my-btn">
          <Trash /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Flashcard</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this Flashcard? This will be moved to your archived and can still be recovered anytime
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>No, keep it</AlertDialogCancel>
          <AlertDialogAction disabled = {isSoftDeletingFlashcard} onClick={() => softDeleteFlashcard({ flashcardId, deckId })}>Yes, Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
