import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Dashboard } from "@pixis/schemas";

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get<{ dashboard: Dashboard }>("/dashboards");
      return res.data.dashboard;
    },
  });
};
