import { zodResolver } from "@hookform/resolvers/zod";
import { DeckFormSchema, type DeckForm } from "@pixis/schemas";
import { useForm } from "react-hook-form";
import { useDeck } from "./useDeck";

export const useDeckCreator = () => {
  const { createDeck, isCreatingDeck } = useDeck();
  const deckForm = useForm<DeckForm>({
    defaultValues: {
      color: "#000000",
      title: "",
      topic: "",
      visibility: "private",
    },
    resolver: zodResolver(DeckFormSchema),
  });

  const onSubmit = deckForm.handleSubmit((data) => createDeck(data));
  return {
    deckForm,
    isCreatingDeck,
    onSubmit,
  };
};
