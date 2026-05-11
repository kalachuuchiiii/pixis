import api from "@/lib/api";
import { DeckSchema, type Deck } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useDeckDetails = (onSuccessCallback?: (c: Deck) => void) => {
  const { deckId = 0 } = useParams();
  return useQuery({
    queryKey: ["deck", deckId],
    throwOnError: true,
    queryFn: async () => {
      const res = await api.get<{ deck: Deck }>(`/decks/${deckId}`);
      const cleanDeck = DeckSchema.parse(res.data.deck);
      if (!!onSuccessCallback) {
        onSuccessCallback(cleanDeck);
      }
      return cleanDeck;
    },
  });
};
