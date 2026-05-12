import { BarChart2, ChevronDown, Play, Star } from "lucide-react";
import type { Technique } from "../../types/types";

export const TechniqueCard = ({ technique }: { technique: Technique }) => {
  return (
    <div
      id={technique.id}
      className={`group relative  rounded-2xl transition-all duration-200 `}
    >
      <div className=" lg:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="font-semibold lg:text-3xl text-zinc-100 text-sm leading-tight">
                {technique.name}
              </h3>
              <span className="text-xs text-zinc-500">
                {technique.category}
              </span>
            </div>
          </div>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {technique.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2"></div>
      </div>

      {/* Expanded content */}

      <div className="border-t border-zinc-800 px-5 pb-5 pt-4 space-y-4">
        {/* Full description */}
        <p className="text-zinc-300 text-sm leading-relaxed">
          {technique.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Benefits */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Star size={12} className="text-amber-400" /> Benefits
            </p>
            <ul className="space-y-1">
              {technique.benefits.map((b) => (
                <li
                  key={b}
                  className="text-sm text-zinc-300 flex items-start gap-2"
                >
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BarChart2 size={12} className="text-violet-400" /> Best For
            </p>
            <ul className="space-y-1">
              {technique.useCases.map((u) => (
                <li
                  key={u}
                  className="text-sm text-zinc-300 flex items-start gap-2"
                >
                  <span className="text-violet-500 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Video embed */}
        <div className="mt-2 ">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Play size={12} className="text-rose-400" /> Watch &amp; Learn
          </p>
          <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${technique.videoId}`}
              title={technique.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            {technique.videoNote}
          </p>
        </div>
      </div>
    </div>
  );
};
