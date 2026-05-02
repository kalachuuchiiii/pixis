import api from "@/lib/api";
import {
  collectionFormSchema,
  type Collection,
  type CollectionForm,
} from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useCollectionDetails = (
  onSuccessCallback?: (collectionForm: CollectionForm) => void
) => {
  const { collectionId = 0 } = useParams();
  return useQuery({
    queryFn: async () => {
      const res = await api.get<{ collection: Collection }>(
        `/collections/${collectionId}`
      );
      const cleanCollection = collectionFormSchema.parse(res.data.collection);
      if (!!onSuccessCallback) {
        onSuccessCallback(cleanCollection);
      }
      return res.data.collection;
    },
    queryKey: ["collection", collectionId],
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
  });
};
