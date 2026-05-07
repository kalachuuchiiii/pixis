import { useIndex } from "@/hooks/useIndex";
import { pop } from "@/hooks/usePopup";
import api from "@/lib/api";
import LandingPage from "@/pages/LandingPage";
import type {
  ExamAnswers,
  Flashcard,
  ResultDetails,
  Session,
  User,
} from "@pixis/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { ResultDetailsPopup } from "../components/ResultDetailsPopup";
import { useTimer } from "./useTimer";

export const useExam = () => {
  const { sessionId = "0" } = useParams();
  const { mode = "normal" } = useParams(); //or timed

  const nav = useNavigate();

  const queryClient = useQueryClient();
  const [flashcardIds, setFlashcardIds] = useState<number[]>([]);
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState<number>(0);
  const correctAnswerSfx = new Audio("/correct-answer-sfx.mp3");
  const wrongAnswerSfx = new Audio("/wrong-answer-sfx.mp3");

  const [examAnswers, setExamAnswers] = useImmer<ExamAnswers>([]);

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
        if (!isRunning) return;
        const res = await api.post<{ result: ResultDetails }>(
          `/flashcard-progress`,
          {
            examAnswers: answers,
            sessionId,
          }
        );
        return res.data;
      },
      throwOnError: true,
      onSuccess: (res) => {
        if (!res?.result) return;
        nav(-1);
        queryClient.setQueryData(["profile-details"], (old: User) => ({
          ...(old ?? {}),
          point: {
            ...(old.point ?? {}),
            currentPoints:
              old.point.currentPoints + res.result.totalPointsGained,
          },
        }));
        pop(() =>
          ResultDetailsPopup({
            resultDetails: res.result,
          })
        );
      },
    });

  const timerHandlers = useTimer(() => processExamAnswers(examAnswers));
  const { isRunning } = timerHandlers;

  const { onNext, onPrevious } = useIndex({
    ceilIndex: flashcardIds.length - 1,
    set: setCurrentFlashcardIdx,
    disabled: !isRunning,
    currentIdx: currentFlashcardIdx,
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
    if (
      !isRunning ||
      !answer.trim() ||
      examAnswers.find((a) => a.flashcardId === flashcard?.id)?.answer.trim()
    )
      return;
    const updatedAnswers = examAnswers.map((a) =>
      a.flashcardId !== flashcard?.id ? a : { ...a, answer }
    );
    setExamAnswers(updatedAnswers);

    if (
      flashcard?.type === "open_ended"
        ? flashcard?.answer === answer
        : flashcard?.answer.trim().toLowerCase() === answer.trim().toLowerCase()
    ) {
      correctAnswerSfx.play();
    } else {
      wrongAnswerSfx.play();
    }

    const next = onNext();

    if (!next?.hasNext && updatedAnswers.every((a) => !!a.answer.trim())) {
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
    mode,
    timerHandlers,
    isFlashcardLoading,
    isProcessingExamAnswers,
    currentFlashcardIdx,
    sessionId,
  };
};

export type UseExamReturn = ReturnType<typeof useExam>;
