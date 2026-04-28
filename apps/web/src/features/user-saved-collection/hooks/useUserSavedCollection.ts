import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUserSavedCollection = () => {
  const queryClient = useQueryClient();
  const invalidateCollection = () =>
    queryClient.invalidateQueries({ queryKey: ["collection"] });

  const { mutate: saveCollection, isPending: isSavingCollection } = useMutation(
    {
      mutationFn: async ({
        collectionId,
      }: {
        collectionId: number | string;
      }) => {
        const promise = api.post(
          `/user-saved-collections/${collectionId}/save`
        );
        toast.promise(promise, {
          loading: "Saving collection...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: () => invalidateCollection(),
    }
  );

  const { mutate: unsaveCollection, isPending: isUnsavingCollection } =
    useMutation({
      mutationFn: async ({
        collectionId,
      }: {
        collectionId: number | string;
      }) => {
        const promise = api.delete(
          `/user-saved-collections/${collectionId}/unsave`
        );
        toast.promise(promise, {
          loading: "Unsaving collection...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
      onSuccess: () => invalidateCollection(),
    });

  return {
    saveCollection,
    unsaveCollection,
    isUnsavingCollection,
    isSavingCollection,
  };
};
