import api from "@/lib/api";
import {  type Deck } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDeckFormManager } from "./useDeckFormManager";

export const useDeckManager = () => {
  const [deck, setDeck] = useState<Deck>({
    title: "",
    description: "",
    color: "#000000",
    id: 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    topic: "",
    totalFlashcards: 0,
    visibility: "public",
    user: {
      username: '',
      nickname: ''
    }
  });

  const { deckId = null } = useParams();
  
  useQuery({
    queryFn: async () => {
      const res = await api.get<{ deck: Deck }>(`/decks/me/${deckId}`);
      setDeck(res.data.deck);
      return res.data.deck;
    },
    queryKey: ["deck", deckId],
  });

  const { handleChangeDeckForm, handleChangeVisibility, addTopic } =
    useDeckFormManager(setDeck);

    const handleControlTotalFlashcardsValue = (type: 'increment' | 'decrement') => {
      setDeck((prev) => ({
        ...prev,
        totalFlashcards: type === 'increment' ? prev.totalFlashcards + 1 : prev.totalFlashcards - 1
      }))
    }

  return {
    handleChangeDeckForm,
    handleControlTotalFlashcardsValue,
    handleChangeVisibility,
    addTopic,
    deck,
  };
};
