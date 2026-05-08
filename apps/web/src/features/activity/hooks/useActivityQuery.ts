import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useActivityQuery = () =>
  useQuery({
    queryFn: async () => {
      const res = await api.get("/dashboards/activity");
      return res.data;
    },
    queryKey: ["activiy"],
  });
