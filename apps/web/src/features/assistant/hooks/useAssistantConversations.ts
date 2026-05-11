import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import api from "@/lib/api";
import type { Conversation } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";

export const useAssistantConversations = () => {
  const { data: user } = useAuthUser();

  const query = useQuery({
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[] }>(
        `/assistant/conversations`
      );
      return res.data.conversations;
    },
    queryKey: ["conversations"],
    staleTime: Infinity,
    retry: false,
    enabled: user.id !== 0,
  });

  return query;
};
