import { useIndex } from "@/hooks/useIndex";
import api from "@/lib/api";
import type { ExamAnswers, Flashcard, Session } from "@pixis/schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";

export const useExam = () => {
  const { sessionId = "0" } = useParams();
  const nav = useNavigate();

  const [flashcardIds, setFlashcardIds] = useState<number[]>([]);
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState<number>(0);

  const [examAnswers, setExamAnswers] = useImmer<ExamAnswers>([]);

  const { onNext, onPrevious } = useIndex({
    ceilIndex: flashcardIds.length - 1,
    set: setCurrentFlashcardIdx,
    currentIdx: currentFlashcardIdx,
  });

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await api.get<{ session: Session }>(`/session/${sessionId}`);
      const session = res.data.session;
      const flashcardIds = session.deck?.flashcardIds ?? [];

      if (flashcardIds?.length === 0) {
        return nav(`/app/decks/${session.deck?.id}`);
      }

      setFlashcardIds(flashcardIds);
      setExamAnswers(flashcardIds.map((f) => ({ flashcardId: f, answer: "" })));
      return session;
    },
    throwOnError: true,
    retry: false,
    staleTime: Infinity,
  });

  const { mutate: processExamAnswers, isPending: isProcessingExamAnswers } =
    useMutation({
      mutationFn: async (answers: ExamAnswers) => {
        const res = await api.post(`/flashcard-progress`, {
          examAnswers: answers,
          sessionId,
        });
        return res.data;
      },
      throwOnError: true,
      onSuccess: () => {
        nav(-1);
      },
    });

  const { data: flashcard, isLoading: isFlashcardLoading } = useQuery({
    queryKey: ["flashcard", flashcardIds[currentFlashcardIdx]],
    queryFn: async () => {
      const res = await api.get<{ flashcard: Flashcard }>(
        `/flashcards/${flashcardIds[currentFlashcardIdx]}`
      );
      if (!res.data.flashcard) {
        return nav(-1);
      }
      return res.data.flashcard;
    },
    throwOnError: true,
    staleTime: Infinity,
    enabled: !!session && flashcardIds.length > 0,
  });

  const answer = examAnswers.find(
    (a) => a.flashcardId === (flashcard?.id ?? 0)
  );

  const setAnswer = (answer: string) => {
    const updatedAnswers = examAnswers.map((a) =>
      a.flashcardId !== flashcard?.id ? a : { ...a, answer }
    );
    setExamAnswers(updatedAnswers);
    const { hasNext } = onNext();

    if (!hasNext && updatedAnswers.every((a) => !!a.answer.trim())) {
      processExamAnswers(updatedAnswers);
    }
  };

  return {
    onNext,
    onPrevious,
    flashcard,
    flashcardIds,
    session,
    answer,
    setAnswer,
    isSessionLoading,
    isFlashcardLoading,
    isProcessingExamAnswers,
    currentFlashcardIdx,
    sessionId,
  };
};
