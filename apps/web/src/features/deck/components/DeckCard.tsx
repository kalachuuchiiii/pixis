import type { Deck } from "@pixis/schemas";
import { Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";


const DeckPreviewCard = ({ deck }: { deck: Deck }) => {
  const { title, description, topic, visibility, updatedAt, id } =
    deck;

  const getRelativeTime = (date: Date) => {
    const diffTime = Math.ceil(
      (Date.now() - date.getTime()) / (1000 * 3600 * 24)
    );
    return diffTime === 0
      ? "Today"
      : diffTime === 1
        ? "Yesterday"
        : `${diffTime} days ago`;
  };

  return (
    <div className="w-full mx-auto">
      <div
        className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm overflow-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
              {topic}
            </span>

            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400">
              {visibility}
            </span>
          </div>

         
        </div>

        {/* Title */}
        <p className="text-[17px] font-semibold text-stone-900 leading-tight mb-3">
          {title || <p className="opacity-75"> Untitled </p>}
        </p>

        {/* Description */}
        {description && (
          <p className="text-[13.5px] text-stone-600 leading-snug line-clamp-2 mb-5">
            {description}
          </p>
        )}

        {/* Flashcard Preview */}
        <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-medium tracking-widest uppercase text-stone-400 mb-2">
            {}
          </p>
          <p className="text-[14px] font-medium text-stone-800 leading-snug">
            Explain the sodium-potassium pump and its role in maintaining
            resting membrane potential.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <Calendar size={13} />
            <span>Updated {getRelativeTime(new Date(updatedAt))}</span>
          </div>

           <Link to={`/app/decks/${id}/manage`}>
           <button className="h-8 px-4 text-[12.5px] font-medium rounded-xl bg-stone-900 text-white hover:bg-black transition-colors">
            Open Deck
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default DeckPreviewCard;
