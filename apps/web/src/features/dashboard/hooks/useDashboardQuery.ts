import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Dashboard } from "@pixis/schemas";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { useParams } from "react-router-dom";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export const useDashboardQuery = () => {
  const { data: user } = useAuthUser();

  const { userId = user.id } = useParams();
  return useQuery({
    queryKey: ["dashboard", userId || user.id],
    queryFn: async () => {
      const res = await api.get<{ dashboard: Dashboard }>("/dashboards");
      return res.data.dashboard;
    },
  });
};
