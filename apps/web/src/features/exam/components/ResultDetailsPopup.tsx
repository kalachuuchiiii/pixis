import type { ResultDetails } from "@pixis/schemas";
import React, { useEffect } from "react";

export const ResultDetailsPopup = ({
  resultDetails,
}: {
  resultDetails: ResultDetails;
}) => {
  const {
    totalPointsGained,
    isStreakIncremented,
    feedback,
    totalFlashcards,
    correctCount,
    accuracy,
    isCompleted,
    isIncomplete,
  } = resultDetails;

  useEffect(() => {
    if (!isIncomplete && isCompleted && totalPointsGained > 0) {
      const victorySfx = new Audio("/victory-sfx.mp3");
      victorySfx.volume = 0.65;
      victorySfx.play().catch(() => {});
    }
  }, [isIncomplete, isCompleted, totalPointsGained]);

  const getResultIcon = () => {
    if (isIncomplete) return "😔";
    if (accuracy >= 90) return "🏆";
    if (accuracy >= 70) return "🎉";
    if (accuracy >= 50) return "👍";
    return "📚";
  };

  const isSuccess = !isIncomplete && isCompleted;

  return (
    <div className="w-full max-w-3xl mx-auto ">
      <div className="flex flex-col gap-6">
        {/* Left Side - Visual Header */}
        <header className="flex flex-col items-center justify-center w-full text-center">
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {feedback}
          </h1>

          {isIncomplete && (
            <p className="mt-2 text-amber-400 text-sm font-medium">
              Failed to answer everything
            </p>
          )}
        </header>

        {/* Right Side - Stats */}
        <main className="flex flex-col gap-4 w-full">
          {/* Points Card */}
          <div className="rounded-2xl border border-zinc-800 dark:bg-zinc-900/70 p-6 sm:p-8 text-center">
            <div className="mb-2 text-xs sm:text-sm uppercase tracking-widest text-zinc-500">
              {isSuccess ? "Points Earned" : "Points"}
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter tabular-nums">
              {isSuccess ? `+${totalPointsGained.toLocaleString()}` : "0"}
            </div>
          </div>

          {/* Accuracy Stats */}
          <div className="rounded-2xl border border-zinc-800 dark:bg-zinc-900/70 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Correct
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-white tabular-nums">
                  {correctCount}{" "}
                  <span className="dark:text-zinc-400 text-zinc-500">
                    / {totalFlashcards}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-400 tabular-nums">
                  {accuracy.toFixed(2)}%
                </div>
                <div className="text-xs uppercase tracking-widest text-zinc-500">
                  Accuracy
                </div>
              </div>
            </div>

            {/* Simple progress bar */}
            <div className="h-2 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          {isStreakIncremented && (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 py-4 px-4">
              <div className="text-2xl">🔥</div>
              <div>
                <div className="font-medium text-amber-400">
                  Streak continued!
                </div>
                <div className="text-sm text-zinc-400">
                  Great job keeping the momentum
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <p className="mt-8 text-center text-xs sm:text-sm text-zinc-500">
        {isIncomplete
          ? "Better luck next time • Click anywhere to continue"
          : "Well done! Click anywhere to continue"}
      </p>
    </div>
  );
};
