import api from "@/lib/api";
import { getSuccessMessage } from "@/utils/message-extractor.utils";
import {
  collectionFormSchema,
  idSchema,
  type CollectionForm,
} from "@pixis/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMyCollection = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  // CREATE
  const { mutate: createCollection, isPending: isCreatingCollection } =
    useMutation({
      mutationFn: async ({
        collectionForm,
      }: {
        collectionForm: CollectionForm;
      }) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const cleanForm = collectionFormSchema.parse(collectionForm);
            return resolve(api.post(`/collections`, cleanForm));
          } catch (e) {
            return reject(e);
          }
        });

        await toast.promise(promise, {
          loading: "Creating collection...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });

        return await promise;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['collections']})
      }
    });

  // UPDATE
  const { mutate: updateCollection, isPending: isUpdatingCollection } =
    useMutation({
      mutationFn: async ({
        collectionForm,
        collectionId,
      }: {
      collectionId: number | string
        collectionForm: CollectionForm;
      }) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const cleanForm = collectionFormSchema.parse(collectionForm);
            const cleanId = idSchema.parse(collectionId);
            return resolve(api.patch(`/collections/${cleanId}`, cleanForm));
          } catch (e) {
            return reject(e);
          }
        });

        await toast.promise(promise, {
          loading: "Updating collection...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });

        return await promise;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['collection']});
      }
    });


  const { mutate: deleteCollection, isPending: isDeletingCollection } =
    useMutation({
      mutationFn: async ({ collectionId }: { collectionId: number | string}) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const cleanId = idSchema.parse(collectionId);
            return resolve(api.delete(`/collections/${cleanId}/permanent`));
          } catch (e) {
            return reject(e);
          }
        });

        await toast.promise(promise, {
          loading: "Deleting collection permanently...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });

        return await promise;
      },
      onSuccess: () => {
        nav('/app/collections')
      }
    });

  // RESTORE
  return {
    createCollection,
    updateCollection,
    deleteCollection,
    isCreatingCollection,
    isUpdatingCollection,
    isDeletingCollection,
  };
};
