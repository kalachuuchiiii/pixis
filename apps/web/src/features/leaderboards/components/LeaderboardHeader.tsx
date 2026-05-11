import type { ReactNode } from "react";
import firstTrophy from "/first-place.gif";
import secondTrophy from "/second-place.gif";
import thirdTrophy from "/third-place.gif";

export const LeaderboardHeader = ({
  children,
}: {
  children?: ReactNode | string;
}) => {
  return (
    <header className="w-full mb-10 flex flex-col items-center text-center">
      <div className="flex items-end gap-6">
        <img src={thirdTrophy} className="size-10" />
        <img src={firstTrophy} className="size-18" />
        <img src={secondTrophy} className="size-10" />
      </div>
      <h1 className="text-4xl font-bold tracking-tighter">Leaderboards</h1>
      <h4 className="text-zinc-500 dark:text-zinc-400 mt-1">
        {children ?? "Top students crushing it with points"}
      </h4>
    </header>
  );
};
