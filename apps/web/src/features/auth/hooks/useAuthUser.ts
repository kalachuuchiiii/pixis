import { closePopup, pop } from "@/hooks/usePopup";
import api from "@/lib/api";
import type { UserWithStats } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { initialUserStatData } from "@/features/account/data/profile";

export const useAuthUser = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.get<{ user: UserWithStats }>("/users/profile");
      return res.data.user;
    },
    queryKey: ["auth-user"],
  });
  const { data, ...result } = query;

  return {
    data: data ?? initialUserStatData,
    ...result,
  };
};
