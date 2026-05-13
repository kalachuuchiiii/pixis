import { useState, useMemo } from "react";
import { Search, Brain, Filter, X } from "lucide-react";
import type { Category, Difficulty, Technique } from "../types/types";
import { studyTechniques } from "../data/studyTechniques";
import { CATEGORIES, DIFFICULTIES } from "../constants/index";
import { TechniqueCard } from "../components/ui/TechniqueCard";

const StudyTechniques = () => {
  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* ── Hero ── */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold  uppercase tracking-widest  px-3 py-1.5 rounded-full mb-5">
            <Brain size={12} /> Learning Science
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 ">
            Study Techniques
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            Explore {studyTechniques.length} scientifically-backed learning
            methods. Click any card to expand details, watch an explanatory
            video, and understand when to apply each technique.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Techniques", value: studyTechniques.length },
              { label: "Categories", value: studyTechniques.length },
              { label: "Video Guides", value: studyTechniques.length },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-bold text-amber-400">
                  {value}
                </span>
                <span className="text-sm text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </header>
        <div className="flex gap-20 flex-col">
          {studyTechniques.map((t) => (
            <TechniqueCard key={t.id} technique={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTechniques;
