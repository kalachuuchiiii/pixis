import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import api from "@/lib/api";
import { IDSchema, type Deck } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useDeckHistory = () => {
  const { userId = "0" } = useParams();
  const { data = [], ...results } = useQuery({
    queryFn: async () => {
      const cleanId = IDSchema.catch(0).parse(userId);
      const res = await api.get<{ decks: Deck[] }>(`/users/${cleanId}/history`);
      return res.data.decks;
    },
    queryKey: ["history", userId],
    staleTime: Infinity,
  });
  return {
    data,
    ...results,
  };
};
