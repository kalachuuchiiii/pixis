import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  flashcardFormSchema,
  type FlashcardForm,
} from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import  { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMyFlashcard } from "./useMyFlashcard";
import { useParams } from "react-router-dom";

export const useFlashcardManager = () => {
  const { flashcardId = 0 } = useParams();

  const [prevChoices, setPrevChoices] = useState<string[]>([]);
  const flashcardForm = useForm<FlashcardForm>({
    defaultValues: {
      type: "open_ended",
      choices: null,
      question: "",
      isAnswerCaseSensitive: false,
      answer: "",
    },
    resolver: zodResolver(flashcardFormSchema),
    mode: "onChange",
  });
  const { reset, handleSubmit, watch } = flashcardForm;
  const { updateFlashcard, isUpdatingFlashcard } = useMyFlashcard();

  const { data, isPending, isLoading, isFetching } = useQuery({
    queryFn: async () => {
      const res = await api.get<{ flashcard: FlashcardForm }>(
        `/flashcards/${flashcardId}`
      );
      reset(res.data.flashcard);
      return res.data.flashcard;
    },
    queryKey: ["flashcard", flashcardId],
  });

  const values = watch();
  const hasNoChanges = useMemo(() => _.isEqual(values, data), [values, data]);

  const handleChangeType = (type: "close_ended" | "open_ended") => {
    if (type === "close_ended") {
      return reset({
        ...values,
        type: "close_ended",
        isAnswerCaseSensitive: false,
        choices: prevChoices,
      });
    }

    setPrevChoices(values.choices ?? []);

    reset({
      ...values,
      choices: null,
      type: "open_ended",
    });
  };

  const onSubmit = handleSubmit(async(data) => {
    await updateFlashcard({ flashcardId, updateForm: data })
  })

  return {
    handleChangeType,
    onSubmit,
    updateFlashcard,
    isUpdatingFlashcard,
    hasNoChanges,
    values,
    isPending,
    isFetching,
    isLoading,
    flashcardForm,
  };
};
