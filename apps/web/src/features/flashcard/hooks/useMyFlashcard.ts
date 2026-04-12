import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import {
  closeEndedFlashcardSchema,
  flashcardFormSchema,
  idSchema,
  type FlashcardForm,
} from "@pixis/schemas";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useMyFlashcard = () => {
  const { mutate: createFlashcard, isPending: isCreatingFlashcard } =
    useMutation({
      mutationFn: async ({
        flashcardForm,
        deckId,
      }: {
        flashcardForm: FlashcardForm;
        deckId: string | number;
      }) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const cleanForm = flashcardFormSchema.parse(flashcardForm);
            const cleanDeckId = idSchema.parse(deckId);
            const p = api.post(`/flashcards/decks/${cleanDeckId}`, {
              ...cleanForm,
            });
            return resolve(p);
          } catch (e) {
            return reject(e);
          }
        });

        await toast.promise(promise, {
          loading: "Creating flashcard...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
    });

  const { mutate: updateFlashcard, isPending: isUpdatingFlashcard } = useMutation({
    mutationFn: async ({
      updateForm,
      flashcardId,
    }: {
      updateForm: FlashcardForm;
      flashcardId: number | string;
    }) => {
      const promise = new Promise((resolve, reject) => {
        try {
          const cleanForm = flashcardFormSchema.parse(updateForm);
          const cleanId = idSchema.parse(flashcardId);
          return resolve(api.patch(`/flashcards/${cleanId}`, cleanForm));
        } catch (e) {
          return reject(e);
        }
      });

      await toast.promise(promise, {
        loading: "Updating flashcard...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
  });

  return {
    createFlashcard,
    updateFlashcard,
    isUpdatingFlashcard,
    isCreatingFlashcard,
  };
};
