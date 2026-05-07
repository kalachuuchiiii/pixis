import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, type FormEvent } from "react";
import type { UseExamReturn } from "../hooks/useExam";

export const OpenEndedAnswerInput = ({
  setAnswer,
  currentFlashcardIdx,
}: {
  setAnswer: UseExamReturn["setAnswer"];
  currentFlashcardIdx: number;
}) => {
  const [input, setInput] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAnswer(input);
    setInput("");
  };

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        id={`open-ended-answer-input.${currentFlashcardIdx}`}
        className="flex flex-col  gap-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer here..."
        />
        <Button
          type="submit"
          form={`open-ended-answer-input.${currentFlashcardIdx}`}
          className="my-btn"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};
