import React from "react";
import { useDeckSessions } from "../hooks/useDeckSessions";
import { SessionCard } from "../components/SessionCard";
import history from "/history.gif";
import { Spinner } from "@/components/ui/spinner";
import { EmptyResource } from "@/components/ui/EmptyResource";

const DeckSessionHistory = () => {
  const { sessions, ref, isFetching, isPending, hasNoData, hasNoMoreData } =
    useDeckSessions();

  return (
    <div className="space-y-2">
      <header className="w-full mb-10 flex flex-col items-center text-center">
        <div className="flex items-end">
          <img src={history} className="size-14" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">Session History</h1>
        <h4 className="text-zinc-500 dark:text-zinc-400 mt-1">
          Your previous sessions
        </h4>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {sessions.map((s) => (
          <SessionCard session={s} />
        ))}
      </main>
      <footer className="my-20">
        {isFetching || isPending ? (
          <Spinner />
        ) : hasNoData ? (
          <EmptyResource
            title="No sessions yet"
            description="You haven't answered this deck yet."
          />
        ) : (
          hasNoMoreData && (
            <EmptyResource
              title="No more sessions"
              description="You've reached the last page"
            />
          )
        )}
      </footer>
      <div ref={ref} />
    </div>
  );
};

export default DeckSessionHistory;
