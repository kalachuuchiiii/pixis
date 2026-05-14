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
import { useFlashcard } from "../hooks/useFlashcard";

export const DeleteFlashcardDialog = ({
  flashcardId,
  deckId,
}: {
  flashcardId: number | string;
  deckId: number | string;
}) => {
  const { deleteFlashcard, isDeletingFlashcard } = useFlashcard();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className="my-btn">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this flashcard? This action cannot
            be undone
          </AlertDialogDescription>
        </AlertDialogHeader>

        <main className="flex items-center justify-end">
          <AlertDialogCancel variant="outline" className="my-btn">
            No, keep it
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="my-btn"
            disabled={isDeletingFlashcard}
            onClick={() => deleteFlashcard({ flashcardId, deckId })}
          >
            Yes, Delete
          </AlertDialogAction>
        </main>
      </AlertDialogContent>
    </AlertDialog>
  );
};
