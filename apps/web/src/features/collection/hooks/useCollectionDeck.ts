import api from "@/lib/api";
import { getErrorMessage, getSuccessMessage } from "@/utils/message-extractor.utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";



export const useCollectionDeck = () => {


    
  const { mutate: addDeckToCollection, isPending: isAddingDeckToCollection } = useMutation({
    mutationFn: async ({ collectionId, deckId }:{collectionId: string | number; deckId: string | number;}) => {
      const promise = api.post(`/collection-deck/${collectionId}/${deckId}`);
      await toast.promise(promise, {
        loading: "Adding deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
  });

  return {
    addDeckToCollection,
    isAddingDeckToCollection
  }
}