import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Pencil } from "lucide-react";
import React, { useState } from "react";
import type { FlashcardFormHandler } from "../hooks/useFlashcardForm";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { OpenEndedForm, type OpenEndedFormType } from "./OpenEndedForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { CHOICES_MAX } from "@pixis/constants";
import { CloseEndedForm, type CloseEndedFormType } from "./CloseEndedForm";
import type { CloseEndedFlashcardForm } from "@pixis/schemas";
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
import { useMyFlashcard } from "../hooks/useMyFlashcard";
import { isEqual } from "lodash";

export const UpdateFlashcardDialog = ({
  flashcardFormHandler,
  flashcardId,
}: {
  flashcardFormHandler: FlashcardFormHandler;
  flashcardId: string | number;
}) => {
  const { flashcardFormValues, flashcardForm, flashcard, hasNoChanges } =
    flashcardFormHandler;
  const { type } =
    flashcardFormValues;
  const { updateFlashcard, isUpdatingFlashcard } = useMyFlashcard();

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="my-btn" variant={"ghost"}>
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="min-w-4/12"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {flashcard?.type === "open_ended" &&
        flashcardFormValues.type === "open_ended" ? (
          <>
            <h1>Open Ended</h1>
            <OpenEndedForm openEndedForm={flashcardForm as OpenEndedFormType} />
          </>
        ) : (
          flashcard?.type === 'close_ended' && flashcardFormValues.type === "close_ended" && (
            <>
              <h1>Close Ended</h1>
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
                <Button onClick={() => flashcardForm.reset()} disabled = {hasNoChanges} className="my-btn" variant={"outline"}>
                  Reset Changes
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="my-btn" disabled = {hasNoChanges}>Update</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Update flashcard</AlertDialogTitle>
                      <AlertDialogDescription>
                        This might affect user's progresses. Are you sure you
                        want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel variant={"default"}>
                        No, cancel
                      </AlertDialogCancel>
                      <AlertDialogCancel
                      disabled = {isUpdatingFlashcard}
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
