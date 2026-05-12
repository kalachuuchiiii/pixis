import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import {
  FlashcardFormSchema,
  IDSchema,
  type Flashcard,
  type FlashcardForm,
} from "@pixis/schemas";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useFlashcard = () => {
  const queryClient = useQueryClient();
  const { deckId } = useParams();

  const { mutate: createFlashcard, isPending: isCreatingFlashcard } =
    useMutation({
      mutationFn: async ({
        flashcardForm,
        deckId,
      }: {
        flashcardForm: FlashcardForm;
        deckId: string | number;
      }) => {
        const promise = new Promise<
          Promise<
            AxiosResponse<
              {
                flashcard: Flashcard;
              },
              any,
              {}
            >
          >
        >((resolve, reject) => {
          try {
            const cleanForm = FlashcardFormSchema.parse(flashcardForm);
            const cleanDeckId = IDSchema.parse(deckId);
            const p = api.post<{ flashcard: Flashcard }>(
              `/flashcards/decks/${cleanDeckId}`,
              {
                ...cleanForm,
              }
            );
            return resolve(p);
          } catch (e) {
            return reject(e);
          }
        });

        toast.promise(promise, {
          loading: "Creating flashcard...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      },
    });

  const { mutate: updateFlashcard, isPending: isUpdatingFlashcard } =
    useMutation({
      mutationFn: async ({
        updateForm,
        flashcardId,
      }: {
        updateForm: FlashcardForm;
        flashcardId: number | string;
      }) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const cleanForm = FlashcardFormSchema.parse(updateForm);
            const cleanId = IDSchema.parse(flashcardId);
            return resolve(api.patch(`/flashcards/${cleanId}`, cleanForm));
          } catch (e) {
            return reject(e);
          }
        });

        toast.promise(promise, {
          loading: "Updating flashcard...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      },
    });

  const { mutate: deleteFlashcard, isPending: isDeletingFlashcard } =
    useMutation({
      mutationFn: async ({
        flashcardId,
      }: {
        flashcardId: number | string;
        deckId: number | string;
      }) => {
        const promise = api.delete(`/flashcards/${flashcardId}/permanent`);

        toast.promise(promise, {
          loading: "Deleting flashcard...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: (_res) => {
        queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      },
    });

  return {
    createFlashcard,
    updateFlashcard,
    isUpdatingFlashcard,
    deleteFlashcard,
    isDeletingFlashcard,
    isCreatingFlashcard,
  };
};
