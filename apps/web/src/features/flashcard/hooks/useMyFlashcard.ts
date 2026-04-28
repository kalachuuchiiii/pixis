import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import {
  closeEndedFlashcardSchema,
  flashcardFormSchema,
  idSchema,
  type Flashcard,
  type FlashcardForm,
} from "@pixis/schemas";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FlashcardListContext } from "../pages/FlashcardList";

type InfiniteFlashcardData =
  | InfiniteData<
      {
        nextPage: number | undefined;
        flashcards: Flashcard[];
        totalFlashcards: number;
      },
      unknown
    >
  | undefined;

export const useMyFlashcard = () => {
  const nav = useNavigate();
  const ctx = useContext(FlashcardListContext);
  const queryClient = useQueryClient();

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
            const cleanForm = flashcardFormSchema.parse(flashcardForm);
            const cleanDeckId = idSchema.parse(deckId);
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

        await toast.promise(promise, {
          loading: "Creating flashcard...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: ['flashcards'] })
      
  
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['flashcards']})
      }
    });


  const { mutate: deleteFlashcard, isPending: isDeletingFlashcard } =
    useMutation({
      mutationFn: async ({
        flashcardId,
        deckId,
      }: {
        flashcardId: number | string;
        deckId: number | string;
      }) => {
        const promise = api.delete(`/flashcards/${flashcardId}/permanent`);

        await toast.promise(promise, {
          loading: "Deleting flashcard...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: (_res, { deckId }) => {
         queryClient.invalidateQueries({ queryKey: ['flashcards']})
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
