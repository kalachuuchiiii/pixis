import { useDeckManager } from "@/features/deck/hooks/useDeckManager";
import { createContext, useContext } from "react";

export const DeckManagerContext = createContext<ReturnType<
  typeof useDeckManager
> | null>(null);

export const useDeckManagerContext = () => {
  const ctx = useContext(DeckManagerContext);
  if (!ctx) {
    console.warn(
      "Component should only be used inside deck manager component."
    );
    throw new Error(
      "Component should only be used inside deck manager component"
    );
  }

  return ctx;
};
