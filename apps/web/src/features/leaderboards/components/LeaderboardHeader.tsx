import type { ReactNode } from "react";
import trophy from "/trophy.gif";

export const LeaderboardHeader = ({
  children,
}: {
  children?: ReactNode | string;
}) => {
  return (
    <header className="w-full mb-10 flex flex-col items-center text-center">
      <div className="flex items-end">
        <img src={trophy} className="size-14" />
      </div>
      <h1 className="text-4xl font-bold tracking-tighter">Leaderboards</h1>
      <h4 className="text-zinc-500 dark:text-zinc-400 mt-1">
        {children ?? "Top students crushing it with points"}
      </h4>
    </header>
  );
};
