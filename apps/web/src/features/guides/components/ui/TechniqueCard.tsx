import { BarChart2, ChevronDown, Play, Star } from "lucide-react";
import type { Technique } from "../../types/types";
import { Separator } from "@/components/ui/separator";

export const TechniqueCard = ({ technique }: { technique: Technique }) => {
  return (
    <div
      id={technique.id}
      className={`group relative  rounded-2xl transition-all duration-200 `}
    >
      <div className="">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="font-semibold lg:text-3xl text-zinc-900 dark:text-zinc-100 text-sm leading-tight">
                {technique.name}
              </h3>
              <span className="text-xs text-zinc-500">
                {technique.category}
              </span>
            </div>
          </div>
        </div>

        <p className="text-zinc-500 text-sm lg:max-w-8/12 leading-relaxed">
          {technique.description}
        </p>
      </div>
      <Separator className="my-6" />

      <div className=" px-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Benefits */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Star size={12} className="text-amber-400" /> Benefits
            </p>
            <ul className="space-y-1">
              {technique.benefits.map((b) => (
                <li
                  key={b}
                  className="text-sm  text-zinc-500 flex items-start gap-2"
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
                  className="text-sm text-zinc-500 flex items-start gap-2"
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
