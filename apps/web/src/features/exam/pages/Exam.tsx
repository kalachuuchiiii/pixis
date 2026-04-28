import api from "@/lib/api";
import type { Flashcard, Session } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const Exam = () => {
  const { sessionId = "0" } = useParams();

  const [flashcardIds, setFlashcardIds] = useState<number[]>([]);
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState<number>(0);
  const currentFlashcardId = useMemo(
    () => flashcardIds[currentFlashcardIdx],
    [flashcardIds, currentFlashcardIdx]
  );

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await api.get<{ session: Session }>(`/session/${sessionId}`);
      setFlashcardIds(res.data.session.deck.flashcardIds ?? [])
      return res.data.session;
    },
    staleTime: Infinity,
  });

  const { data: flashcard, isLoading: isFlashcardLoading } = useQuery({
    queryKey: ["flashcard", currentFlashcardId],
    queryFn: async (flash) => {
      const res = await api.get<{ flashcard: Flashcard }>(
        `/flashcards/${currentFlashcardId}`
      );
      return res.data.flashcard;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="border-b bg-white dark:bg-zinc-900 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Leave Button with AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-5 h-5" />
                <span className="ml-2 hidden sm:inline">Leave</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Session?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your progress will not be saved. Are you sure you want to
                  exit?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Yes, Leave
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-muted-foreground">
              {2 + 1} / {100}
            </div>
            <div className="w-64 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((2 + 1) / 100) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Session #{session?.id}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Flashcard Area */}
          <div className="bg-white dark:bg-zinc-900 border border-border rounded-3xl shadow-xl min-h-[420px] flex flex-col items-center justify-center p-12 relative">
            <div className="text-center w-full">
              <div className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
                QUESTION {2 + 1}
              </div>

              <h2 className="text-3xl leading-tight font-medium text-foreground mb-12">
                {flashcard?.question}
              </h2>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 px-4">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              Nexta
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
