import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import {
  rawDeckFormSchema,
  type RawDeckForm,
} from "@pixis/schemas";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useDeckFormManager } from "./useDeckFormManager";

export const useCreateDeck = () => {
  const [deckForm, setDeckForm] = useState<RawDeckForm>({
    title: "",
    description: "",
    visibility: "public",
    topic: "",
    color: "#000000",
  });
  const { handleChangeDeckForm, handleChangeVisibility, addTopic } =
    useDeckFormManager(setDeckForm);

  const { mutate: createDeck, isPending: isCreatingDeck } = useMutation({
    mutationFn: async () => {
      const promise = api.post("/decks", deckForm);
      await toast.promise(promise, {
        loading: "Creating deck...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
  });

  const deckFormError =
    rawDeckFormSchema.safeParse(deckForm).error?.issues[0].message;

  return {
    handleChangeDeckForm,
    deckForm,
    deckFormError,
    createDeck,
    isCreatingDeck,
    handleChangeVisibility,
    addTopic,
  };
};
