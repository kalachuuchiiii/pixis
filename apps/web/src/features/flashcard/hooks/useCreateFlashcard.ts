import { useState } from "react";
import {
  CloseEndedFlashcardFormSchema,
  OpenEndedFlashcardFormSchema,
  type CloseEndedFlashcardForm,
  type Flashcard,
  type OpenEndedFlashcardForm,
} from "@pixis/schemas";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFlashcard } from "./useFlashcard";

export const useCreateFlashcard = () => {
  const [type, setType] = useState<Flashcard["type"] | "">("");
  const { deckId = 0 } = useParams();

  const { createFlashcard, isCreatingFlashcard } = useFlashcard();
  const closeEndedForm = useForm<CloseEndedFlashcardForm>({
    defaultValues: {
      type: "close_ended",
      answer: "",
      choices: [],
      question: "",
      isAnswerCaseSensitive: false,
    },
    mode: "onChange",
    resolver: zodResolver(CloseEndedFlashcardFormSchema),
  });

  const openEndedForm = useForm<OpenEndedFlashcardForm>({
    defaultValues: {
      type: "open_ended",
      answer: "",
      choices: null,
      question: "",
      isAnswerCaseSensitive: false,
    },
    resolver: zodResolver(OpenEndedFlashcardFormSchema),
  });

  const onSubmitCloseEnded = closeEndedForm.handleSubmit(async (data) => {
    await createFlashcard({ flashcardForm: data, deckId });
  });

  const onSubmitOpenEnded = openEndedForm.handleSubmit(async (data) => {
    await createFlashcard({ flashcardForm: data, deckId });
  });

  return {
    type,
    deckId,
    closeEndedForm,
    openEndedForm,
    onSubmitCloseEnded,
    onSubmitOpenEnded,
    isCreatingFlashcard,
    setType,
  };
};

export type CreateCloseEndedForm = ReturnType<
  typeof useCreateFlashcard
>["closeEndedForm"];
export type CreateOpenEndedForm = ReturnType<
  typeof useCreateFlashcard
>["openEndedForm"];
