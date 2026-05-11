import { useDeckDetails } from "@/features/deck/hooks/useDeckDetails";
import { useDeckHistory } from "@/features/deck/hooks/useDeckHistory";
import React from "react";
import { useProfileDetails } from "../../account/hooks/useProfileDetails";
import clsx from "clsx";
import { DeckDisplay } from "@/features/deck/components/DeckDisplay";
import { useParams } from "react-router-dom";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const DeckHistory = () => {
  const { data: user } = useProfileDetails();
  const { data: me } = useAuthUser();
  const { data: decks } = useDeckHistory();

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start p-2 justify-between">
        <h2 className="text-2xl font-semibold">Recent Activity</h2>
        <span className=" text-zinc-500 lg:text-lg text-base">
          {user.isPrivate && me.id !== user.id
            ? "History is hidden"
            : "Last 3 decks answered"}
        </span>
      </div>
      {(!user.isPrivate || me.id === user.id) && (
        <main className="grid gap-4  grid-cols-1 lg:grid-cols-2  ">
          {decks.map((d, i) => (
            <div
              key={d.id}
              className={clsx(`translate-y-${2 * i}  opacity-${100 - 20 * i}`)}
            >
              <DeckDisplay.Default deck={d} />
            </div>
          ))}
        </main>
      )}
    </div>
  );
};

export default DeckHistory;
