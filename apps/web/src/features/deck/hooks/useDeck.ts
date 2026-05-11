import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import { type DeckForm } from "@pixis/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useDeck = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();

  const { mutate: createDeck, isPending: isCreatingDeck } = useMutation({
    mutationFn: async (form: DeckForm) => {
      const promise = api.post("/decks", form);
      await toast.promise(promise, {
        loading: "Creating deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
  });

  const { mutate: updateDeck, isPending: isUpdatingDeck } = useMutation({
    mutationFn: async ({
      deckForm,
      deckId,
    }: {
      deckForm: DeckForm;
      deckId: number | string;
    }) => {
      const promise = api.patch(`/decks/${deckId}`, deckForm);
      await toast.promise(promise, {
        loading: "Updating deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["deck", String(deckId)] });
    },
  });

  const { mutate: softDeleteDeck, isPending: isSoftDeletingDeck } = useMutation(
    {
      mutationFn: async ({ deckId }: { deckId: number }) => {
        const promise = api.delete(`/decks/${deckId}`);
        await toast.promise(promise, {
          loading: "Deleting deck...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: () => {
        nav(`/app/profile/${user.id}/decks`);
      },
    }
  );

  return {
    createDeck,
    updateDeck,
    softDeleteDeck,
    isSoftDeletingDeck,
    isUpdatingDeck,
    isCreatingDeck,
  };
};
