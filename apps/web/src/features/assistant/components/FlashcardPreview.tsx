import { ChevronDown, Layers } from "lucide-react";
import { useState } from "react";

export const FlashcardPreview = ({
  cards,
}: {
  cards: { q: string; a: string }[];
}) => {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <div className="mt-3 space-y-2">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-zinc-400 mb-2">
        {cards.length} cards generated
      </p>
      {cards.map((c, i) => (
        <button
          key={i}
          onClick={() => setFlipped(flipped === i ? null : i)}
          className="w-full text-left border border-zinc-200 rounded-xl p-4 bg-white hover:border-zinc-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[12.5px] font-medium text-zinc-800 leading-snug">
                {c.q}
              </p>
              {flipped === i && (
                <p className="text-[12px] text-zinc-500 mt-2 pt-2 border-t border-zinc-100 leading-snug">
                  {c.a}
                </p>
              )}
            </div>
            <ChevronDown
              size={13}
              className={`text-zinc-300 flex-shrink-0 mt-0.5 transition-transform ${flipped === i ? "rotate-180" : ""}`}
            />
          </div>
        </button>
      ))}
      <button className="w-full mt-1 h-9 rounded-xl bg-zinc-900 text-white text-[12.5px] font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
        <Layers size={13} />
        Save as deck
      </button>
    </div>
  );
};
