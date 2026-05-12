import { useUserSavedDeck } from "../hooks/useUserSavedDeck";
import type { Deck } from "@pixis/schemas";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SaveOrUnsaveDeckButton = ({ deck }: { deck: Deck }) => {
  const { saveDeck, unsaveDeck, isUnsavingDeck, isSavingDeck } =
    useUserSavedDeck();

  return deck.savedByMe ? (
    <Tooltip>
      <TooltipTrigger>
        <Button
          disabled={isUnsavingDeck}
          onClick={() => unsaveDeck({ deckId: deck.id })}
          variant={"outline"}
          className="my-btn"
        >
          <Bookmark className="text-yellow-500" />{" "}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Unsave deck</TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip>
      <TooltipTrigger>
        <Button
          disabled={isSavingDeck}
          onClick={() => saveDeck({ deckId: deck.id })}
          variant={"outline"}
          className="my-btn"
        >
          <Bookmark />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Save deck</TooltipContent>
    </Tooltip>
  );
};
