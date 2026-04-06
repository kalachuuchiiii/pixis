import { answerSchema, choicesSchema, closeEndedFlashcardSchema, idSchema, type Flashcard,  } from "@pixis/schemas";
import {useState, type ChangeEvent } from "react";
import { Plus, Trash2, } from "lucide-react"; // optional but recommended
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import { useDeckManagerContext } from "../hooks/useDeckManagerContext";
import { useParams } from "react-router-dom";



export const CloseEndedFlashcardForm = ({ deckId }:{deckId: number}) => {

  const [flashcard, setFlashcard] = useState<
    Flashcard & { type: "close_ended" }
  >({
    question: "",
    answer: "",
    choices: [],
    type: "close_ended",
    deckId
  });
  const [newChoice, setNewChoice] = useState("");
  const { handleControlTotalFlashcardsValue } = useDeckManagerContext();

  const handleQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFlashcard((prev) => ({ ...prev, question: e.target.value }));
  };

  const addChoice = () => {
    if (answerSchema.safeParse(newChoice).error || flashcard.choices.some((c) => c.trim() === newChoice.trim())) { return; }

    setFlashcard((prev) => ({
      ...prev,
      choices: [...prev.choices, newChoice.trim()],
    }));
    setNewChoice("");
  };

  const removeChoice = (index: number) => {
    setFlashcard((prev) => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
      answer: prev.answer === prev.choices[index] ? "" : prev.answer,
    }));
  };

  const handleChangeAnswer = (val: string) => {
    setFlashcard((prev) => ({
      ...prev,
      answer: val,
    }));
  };

  const formError =
    closeEndedFlashcardSchema.safeParse(flashcard).error?.issues[0].message;

  const { mutate: createFlashcard } = useMutation({
    mutationFn: async () => {
      const promise = new Promise((resolve, reject) => {
        try {
          const form = closeEndedFlashcardSchema.parse(flashcard);
          const promise = api.post("/flashcards", {...form});
          return resolve(promise);
        } catch (e) {
          return reject(e);
        }
      });

      await toast.promise(promise, {
        loading: "Creating flashcard...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: () => {
      handleControlTotalFlashcardsValue('increment');
    },
  });

  return (
    <div className="bg-white w-full mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div>
          <h1 className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-2">
            New Flashcard
          </h1>
          <h1
            className="text-[28px] font-normal text-stone-900 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Close-Ended
          </h1>
        </div>
        <div className="text-xs text-stone-400 ml-auto">
          {flashcard.choices.length}/6 choices
        </div>
      </div>

      {/* Question */}
      <div className="mb-10">
        <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500 mb-3">
          QUESTION
        </label>
        <Textarea
          value={flashcard.question}
          onChange={handleQuestionChange}
          placeholder="What is the capital of France?"
          rows={4}
        />
      </div>

      {/* Choices */}
      <div className="mb-10">
        <div className="mb-4">
          <label className="block text-sm font-semibold tracking-widest uppercase text-stone-500 ">
            CHOICES
          </label>
          <span className="text-xs font-light">
            After coming up with the options, pick the correct answer
          </span>
        </div>
        <motion.div
          layout="preserve-aspect"
          className="gap-2 flex grid grid-cols-2 "
        >
          {flashcard.choices.map((choice, index) => (
            <div
              className={clsx(
                "flex items-center duration-100  transition-colors outline justify-between rounded-lg",
                choice === flashcard.answer &&
                  "outline-emerald-200 outline-2 bg-emerald-100"
              )}
              key={index}
            >
              <button
                className={"w-full text-left p-3"}
                onClick={() => handleChangeAnswer(choice)}
              >
                {choice}
              </button>
              <button onClick={() => removeChoice(index)} className="p-3">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Add new choice */}
        {flashcard.choices.length < 6 && (
          <div className="flex gap-2 mt-3">
            <Input
              type="text"
              className="p-5"
              value={newChoice}
              onChange={(e) => setNewChoice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChoice()}
              placeholder="Add new choice..."
            />
            <Button
              className="p-5"
              onClick={addChoice}
              disabled={!newChoice.trim()}
            >
              <Plus size={20} />
              Add
            </Button>
          </div>
        )}
      </div>
      <Button onClick={() => createFlashcard()} disabled={!!formError} className="my-btn w-full">
        Create
      </Button>

      {/* Correct Answer */}
    </div>
  );
};
