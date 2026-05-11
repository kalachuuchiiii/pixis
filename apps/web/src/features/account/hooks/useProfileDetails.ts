import api from "@/lib/api";
import { IDSchema, type User, type UserWithStats } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { initialUserStatData } from "../data/profile";

export const useProfileDetails = () => {
  const { userId = "0" } = useParams();

  const { data, error, ...result } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const cleanId = IDSchema.catch(0).parse(userId);
      const res = await api.get<{ user: UserWithStats }>(
        `/users/${cleanId}/profile`
      );
      return res.data.user;
    },
  });

  return {
    data: data ?? initialUserStatData,
    ...result,
  };
};
