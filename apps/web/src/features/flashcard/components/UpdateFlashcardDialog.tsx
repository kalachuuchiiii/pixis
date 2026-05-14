import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

import type { FlashcardFormHandler } from "../hooks/useFlashcardForm";
import { OpenEndedForm, type OpenEndedFormType } from "./OpenEndedForm";

import { CloseEndedForm, type CloseEndedFormType } from "./CloseEndedForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFlashcard } from "../hooks/useFlashcard";

export const UpdateFlashcardDialog = ({
  flashcardFormHandler,
  flashcardId,
}: {
  flashcardFormHandler: FlashcardFormHandler;
  flashcardId: string | number;
}) => {
  const { flashcardFormValues, flashcardForm, flashcard, hasNoChanges } =
    flashcardFormHandler;
  const { updateFlashcard, isUpdatingFlashcard } = useFlashcard();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-btn w-full" variant={"ghost"}>
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-full lg:min-w-6/12 px-4 lg:px-12 py-6"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {flashcard?.type === "open_ended" &&
        flashcardFormValues.type === "open_ended" ? (
          <>
            <OpenEndedForm openEndedForm={flashcardForm as OpenEndedFormType} />
          </>
        ) : (
          flashcard?.type === "close_ended" &&
          flashcardFormValues.type === "close_ended" && (
            <>
              <CloseEndedForm
                className="min-w-8/12"
                closeEndedForm={flashcardForm as CloseEndedFormType}
              />
            </>
          )
        )}
        <footer className="flex items-center justify-end gap-1">
          <DialogClose>
            <Button className="my-btn" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => flashcardForm.reset()}
            disabled={hasNoChanges}
            className="my-btn"
            variant={"outline"}
          >
            Reset Changes
          </Button>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="my-btn" disabled={hasNoChanges}>
                Update
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Update flashcard</AlertDialogTitle>
                <AlertDialogDescription>
                  This might affect user's progresses. Are you sure you want to
                  continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant={"default"}>
                  No, cancel
                </AlertDialogCancel>
                <AlertDialogCancel
                  disabled={isUpdatingFlashcard}
                  onClick={() =>
                    updateFlashcard({
                      updateForm: flashcardFormValues,
                      flashcardId,
                    })
                  }
                >
                  Yes, update
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
