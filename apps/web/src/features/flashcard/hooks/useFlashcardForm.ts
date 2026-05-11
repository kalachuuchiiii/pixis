import { zodResolver } from "@hookform/resolvers/zod";
import {
  FlashcardFormSchema,
  type Flashcard,
  type FlashcardForm,
} from "@pixis/schemas";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export const useFlashcardForm = (fc?: Flashcard) => {
  const [prevChoices, setPrevChoices] = useState<string[]>([]);
  const flashcardForm = useForm<FlashcardForm>({
    defaultValues: FlashcardFormSchema.safeParse(fc).data ?? {
      type: "open_ended",
      question: "",
      answer: "",
      choices: null,
      isAnswerCaseSensitive: false,
    },
    resolver: zodResolver(FlashcardFormSchema),
    mode: "onChange",
  });
  const { reset, watch } = flashcardForm;

  const flashcardFormValues = watch();
  const hasNoChanges = useMemo(
    () => _.isEqual(FlashcardFormSchema.parse(fc), flashcardFormValues),
    [flashcardFormValues, fc]
  );

  const handleChangeType = (type: "close_ended" | "open_ended") => {
    if (type === "close_ended") {
      return reset({
        ...flashcardFormValues,
        type: "close_ended",
        isAnswerCaseSensitive: false,
        choices: prevChoices,
      });
    }

    setPrevChoices(flashcardFormValues.choices ?? []);
    reset({
      ...flashcardFormValues,
      choices: null,
      type: "open_ended",
    });
  };

  return {
    handleChangeType,
    hasNoChanges,
    flashcardFormValues,
    flashcardForm,
    flashcard: fc,
  };
};

export type FlashcardFormHandler = ReturnType<typeof useFlashcardForm>;
