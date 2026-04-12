import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import type { RawDeckForm } from "@pixis/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeck = () => {
  const { mutate: createDeck, isPending: isCreatingDeck } = useMutation({
    mutationFn: async (rawDeckForm: RawDeckForm) => {
      const promise = api.post("/decks", rawDeckForm);
      await toast.promise(promise, {
        loading: "Creating deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
  });


   const { mutate: updateDeck, isPending: isUpdatingDeck } = useMutation({
    mutationFn: async ({ rawDeckForm, deckId }: {rawDeckForm: RawDeckForm, deckId: number }) => {
      const promise = api.patch(`/decks/${deckId}`, rawDeckForm);
      await toast.promise(promise, {
        loading: "Updating deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
  });

  return {
    createDeck,
    updateDeck,
    isUpdatingDeck,
    isCreatingDeck,
  };
};
