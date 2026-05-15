import { Button } from "@/components/ui/button";
import type { UseExamReturn } from "../hooks/useExam";
import type { Flashcard } from "@pixis/schemas";
import { shuffle } from "lodash";
import { memo, useMemo } from "react";

export const CloseEndedAnswerChoices = memo(
  ({
    setAnswer,
    answer,
    flashcard,
  }: Pick<UseExamReturn, "answer" | "setAnswer"> & {
    flashcard: Flashcard & { type: "close_ended" };
  }) => {
    const choices = useMemo(() => shuffle(flashcard.choices), [flashcard.id]);
    return (
      <main className="grid grid-cols-2 h-full gap-1 w-full">
        {choices.map((c) => (
          <Button
            className="whitespace-normal text-xs p-2 lg:text-sm break-words min-h-8 wrap h-full"
            onClick={() => setAnswer(c)}
            variant={answer?.answer === c ? "default" : "outline"}
          >
            {c}
          </Button>
        ))}
      </main>
    );
  }
);
