import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { flashcardFormSchema, type Flashcard, type FlashcardForm } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useMemo, useState } from "react";
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
  const { updateFlashcard, isUpdatingFlashcard, deleteFlashcard, isDeletingFlashcard } = useMyFlashcard();

  const { data: flashcard, isPending, isLoading, isFetching } = useQuery({ //flashcard is immutable, use flashcardForm to write
    queryFn: async () => { 
      const res = await api.get<{ flashcard: Flashcard }>(
        `/flashcards/${flashcardId}`
      );
      const flashcardForm = flashcardFormSchema.parse(res.data.flashcard);
      reset(flashcardForm);
      return res.data.flashcard;
    },
    queryKey: ["flashcard", flashcardId],
  });

  const flashcardFormValues = watch();
  const flashcardValues = useMemo(() => flashcardFormSchema.safeParse(flashcard).data, [flashcard]);
  const hasNoChanges = useMemo(() => _.isEqual(flashcardValues, flashcardFormValues), [flashcardFormValues, flashcardValues]);

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

  const onSubmit = handleSubmit(async (data) => {
    await updateFlashcard({ flashcardId, updateForm: data });
  });

  const disabled = (isPending ||
      isFetching ||
      isLoading || isUpdatingFlashcard || isDeletingFlashcard);

  return {
    handleChangeType,
    hasNoChanges,
    onSubmit,
    disabled,
    updateFlashcard,
    isUpdatingFlashcard,
    deleteFlashcard,
    isDeletingFlashcard,
    flashcardFormValues,
    flashcardForm,
    flashcard
  };
};
