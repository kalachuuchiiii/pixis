import api from "@/lib/api";
import type { ExamMode } from "@pixis/constants";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useExam = () => {
  const nav = useNavigate();

  const { mutate: createNewSession, isPending: isCreatingNewSession } =
    useMutation({
      mutationFn: async ({
        mode,
        deckId,
      }: {
        mode: ExamMode;
        deckId: number | string;
      }) => {
        const res = await api.post<{ sessionId: number }>(
          `/session/${deckId}`,
          { mode }
        );
        return res.data.sessionId;
      },
      onSuccess: (sessionId, { mode }) => {
        nav(`/app/exam/${mode.toLowerCase()}/${sessionId}`);
      },
    });

  return {
    createNewSession,
    isCreatingNewSession,
  };
};
