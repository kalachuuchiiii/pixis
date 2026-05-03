import type { ResultDetails } from "@pixis/schemas";
import React, { useEffect } from "react";

export const ResultDetailsPopup = ({
  resultDetails,
}: {
  resultDetails: ResultDetails;
}) => {
  const { totalPointsGained, isStreakIncremented, feedback } = resultDetails;

  useEffect(() => {
    const victorySfx = new Audio("/victory-sfx.mp3");
    victorySfx.volume = 0.65;
    victorySfx.play().catch(() => {});
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <header className="flex flex-col items-center justify-center md:w-5/12 text-center">
          <span className="text-7xl sm:text-8xl drop-shadow-md">🏆</span>

          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {feedback}
          </h1>
        </header>

        <main className="flex flex-col gap-4 md:w-7/12">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 text-center">
            <div className="mb-2 text-xs sm:text-sm uppercase tracking-widest text-zinc-500">
              Points Earned
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums">
              +{totalPointsGained.toLocaleString()}
            </div>
          </div>

          {isStreakIncremented && (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 py-4 px-4">
              <div className="text-2xl">🔥</div>
              <div>
                <div className="font-medium text-amber-400">
                  Streak continued
                </div>
                <div className="text-sm text-zinc-400">Keep it going</div>
              </div>
            </div>
          )}
        </main>
      </div>

      <p className="mt-8 text-center text-xs sm:text-sm text-zinc-500">
        Click anywhere to continue
      </p>
    </div>
  );
};
