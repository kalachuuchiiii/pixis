import { Button } from "@/components/ui/button";
import type { UseExamReturn } from "../hooks/useExam";
import type { Flashcard } from "@pixis/schemas";

export const CloseEndedAnswerChoices = ({
  setAnswer,
  answer,
  flashcard,
}: Pick<UseExamReturn, "answer" | "setAnswer"> & {
  flashcard: Flashcard & { type: "close_ended" };
}) => {
  return (
    <main className="grid grid-cols-2 gap-1 w-full">
      {flashcard.choices.map((c) => (
        <Button
          onClick={() => setAnswer(c)}
          variant={answer?.answer === c ? "default" : "outline"}
        >
          {c}
        </Button>
      ))}
    </main>
  );
};
