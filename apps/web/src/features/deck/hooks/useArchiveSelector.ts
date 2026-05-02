import type { Deck } from "@pixis/schemas";
import { useCallback, useState } from "react";

export const useArchiveSelector = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectOrDeselect = (id: number) => {
    if (!isSelecting) return;
    if (selected.includes(id)) {
      return setSelected((prev) => prev.filter((deckId) => deckId !== id));
    }
    return setSelected((prev) => [...prev, id]);
  };

  const handleToggleIsSelecting = useCallback(
    () => setIsSelecting((prev) => !prev),
    []
  );

  return {
    handleSelectOrDeselect,
    handleToggleIsSelecting,
    selected,
    isSelecting,
    setIsSelecting,
  };
};

export type UseArchiveSelectReturn = ReturnType<typeof useArchiveSelector>;
