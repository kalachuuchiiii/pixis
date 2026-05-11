import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { memo, useState, type FormEvent } from "react";
import type { UseExamReturn } from "../hooks/useExam";
import {
  InputGroup,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Tooltip } from "@/components/ui/tooltip";

export const OpenEndedAnswerInput = memo(
  ({
    setAnswer,
    currentFlashcardIdx,
    isCaseSensitive,
  }: {
    setAnswer: UseExamReturn["setAnswer"];
    isCaseSensitive: boolean;
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
          <InputGroup className="flex flex-col items-start">
            {isCaseSensitive && (
              <p className="text-xs px-2 py-1 opacity-30 text-left">
                Case Sensitive
              </p>
            )}
            <InputGroupTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer here..."
            />
          </InputGroup>
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
  }
);
