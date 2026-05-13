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
import { Textarea } from "@/components/ui/textarea";
import { useExam } from "../hooks/useExam";
import { Spinner } from "@/components/ui/spinner";
import { OpenEndedAnswerInput } from "../components/OpenEndedAnswerInput";
import { CloseEndedAnswerChoices } from "../components/CloseEndedAnswerChoices";
import { Timer } from "../components/Timer";
import clsx from "clsx";

const Exam = () => {
  const {
    onNext,
    onPrevious,
    flashcard,
    flashcardIds,
    session,
    answer,
    currentFlashcardIdx,
    setAnswer,
    isFlashcardLoading,
    isSessionLoading,
    timerHandlers,
    mode,
    processExamAnswers,
    isProcessingExamAnswers,
  } = useExam();

  if (isProcessingExamAnswers) {
    return (
      <main className=" text-4xl tracking-tighter overflow-hidden w-screen h-screen flex items-center justify-center">
        <div className="flex items-center gap-4 overflow-hidden">
          <Spinner /> Assessing Exam...
        </div>
      </main>
    );
  }

  if (isSessionLoading) {
    return (
      <main className=" text-4xl tracking-tighter overflow-hidden w-screen h-screen flex items-center justify-center">
        <div className="flex items-center gap-4 overflow-hidden">
          <Spinner /> Preparing Exam...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      <div className="border-b bg-white dark:bg-zinc-900 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex w-full items-center gap-4">
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
              <main className="flex items-center justify-end gap-2">
                <AlertDialogCancel variant={"outline"} className="my-btn">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => processExamAnswers()}
                  variant={"destructive"}
                  className="bg-destructive my-btn hover:bg-destructive/90"
                >
                  Yes, Leave
                </AlertDialogAction>
              </main>
            </AlertDialogContent>
          </AlertDialog>

          {/* Progress Indicator */}
          <div className="flex w-full  items-center gap-3">
            <div className="text-xs truncate lg:text-sm font-medium text-muted-foreground">
              {currentFlashcardIdx + 1} / {session?.deck?.flashcardIds?.length}
            </div>
            <div className="w-3/12 shrink-1 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${((currentFlashcardIdx + 1) / flashcardIds.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-xs shrink-0 truncate dark:text-sm text-muted-foreground">
          Session #{session?.id}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:flex-row flex flex-col lg:items-center   lg:gap-30 justify-center p-6">
        {mode === "timed" && <Timer {...timerHandlers} />}
        <div
          className={clsx(
            `${!timerHandlers.isRunning && "opacity-50"} max-w-2xl w-full`
          )}
        >
          {/* Flashcard Area */}

          <div className="bg-white dark:bg-zinc-900 w-full border border-border rounded-3xl shadow-xl min-h-[420px] flex flex-col items-center justify-center p-12 relative">
            <div className="text-center w-full">
              <div className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
                QUESTION {currentFlashcardIdx + 1}
              </div>

              <h2 className="text-3xl leading-tight wrap break-all font-medium text-foreground mb-12">
                {flashcard?.question}
              </h2>
              <div>
                {flashcard?.type === "close_ended" ? (
                  <CloseEndedAnswerChoices
                    answer={answer}
                    setAnswer={setAnswer}
                    flashcard={flashcard}
                  />
                ) : (
                  <OpenEndedAnswerInput
                    isCaseSensitive={flashcard?.isAnswerCaseSensitive || false}
                    currentFlashcardIdx={currentFlashcardIdx}
                    setAnswer={setAnswer}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 px-4">
            <Button
              variant="outline"
              size="lg"
              disabled={isFlashcardLoading}
              onClick={onPrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="lg"
              disabled={isFlashcardLoading}
              onClick={onNext}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
