import api from "@/lib/api";
import type { Conversation } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";

export const useAssistantConversations = () =>
  useQuery({
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[] }>(
        `/assistant/conversations`
      );
      return res.data.conversations;
    },
    queryKey: ["conversations"],
  });
