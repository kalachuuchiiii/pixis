import api from "@/lib/api";
import { getSuccessMessage } from "@/utils/message-extractor.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "react-error-boundary";
import { toast } from "sonner";

export const useUserSavedDeck = () => {
  const queryClient = useQueryClient();

  const { mutate: saveDeck, isPending: isSavingDeck } = useMutation({
    mutationFn: async ({ deckId }: { deckId: number | string }) => {
      const p = api.post(`/user-saved-deck/${deckId}`);
      await toast.promise(p, {
        loading: "Saving deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await p;
    },
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["deck"] });
    },
  });

  const { mutate: unsaveDeck, isPending: isUnsavingDeck } = useMutation({
    mutationFn: async ({ deckId }: { deckId: number | string }) => {
      const p = api.delete(`/user-saved-deck/${deckId}`);
      await toast.promise(p, {
        loading: "Unsaving deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await p;
    },
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["deck"] });
    },
  });

  return {
    saveDeck,
    unsaveDeck,
    isSavingDeck,
    isUnsavingDeck,
  };
};
