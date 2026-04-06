
import { type Flashcard } from "@pixis/schemas";
import { useState, type ChangeEvent } from "react";

const openEndedFlashcard: Flashcard = {
  question: "",
  type: "open_ended",
  choices: null,
  answer: "",
};

const closeEndedFlashcard: Flashcard = {
  question: "",
  type: "close_ended",
  choices: [],
  answer: "",
};


export const useCreateFlashcards = () => {
  const [flashcardForm, setFlashcardForm] = useState<Flashcard>({
    question: "",
    type: "open_ended",
    choices: null,
    answer: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlashcardForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return {
    flashcardForm,
    handleChange
  }


};
