import api from "@/lib/api.ts";
import { getSuccessMessage } from "@/utils/message-extractor.utils";
import type { ChatMessage, Deck, GeneratedSet } from "@pixis/schemas";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const useAssistant = () => {
  const { conversationId = "" } = useParams();
  const navigate = useNavigate();

  const { mutate: generateSet, isPending: isGeneratingSet } = useMutation({
    mutationFn: async (generatedSet: GeneratedSet) => {
      const p = api.post<{ deckId: number }>("/assistant/generate", {
        generatedSet,
      });
      await toast.promise(p, {
        loading: "Saving set...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await p;
    },
    onSuccess: ({ data: { deckId } }) => {
      navigate(`/app/decks/${deckId}/flashcards`);
    },
  });

  const {
    mutate: sendGenerateChatPrompt,
    isPending: isSendingGenerateChatPrompt,
  } = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await api.post(`/assistant/chat/generate`, { prompt });
      return res.data;
    },
    onSuccess: () => {},
  });

  return {
    sendGenerateChatPrompt,
    isSendingGenerateChatPrompt,
    generateSet,
    isGeneratingSet,
  };
};
