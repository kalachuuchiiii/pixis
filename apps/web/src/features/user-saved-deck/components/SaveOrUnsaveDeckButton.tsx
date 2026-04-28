import React from "react";
import { useUserSavedDeck } from "../hooks/useUserSavedDeck";
import type { Deck } from "@pixis/schemas";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

export const SaveOrUnsaveDeckButton = ({ deck }: { deck: Deck }) => {
  const { saveDeck, unsaveDeck, isUnsavingDeck, isSavingDeck } =
    useUserSavedDeck();

  return deck.savedByMe?.id ? (
    <Button
      disabled={isUnsavingDeck}
      onClick={() => unsaveDeck({ deckId: deck.id })}
      variant={"outline"}
      className="my-btn"
    >
      <Bookmark className="text-yellow-500" /> Unsave
    </Button>
  ) : (
    <Button
      disabled={isSavingDeck}
      onClick={() => saveDeck({ deckId: deck.id })}
      variant={"outline"}
      className="my-btn"
    >
      <Bookmark /> Save
    </Button>
  );
};
