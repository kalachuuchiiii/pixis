import { Clock, Trophy, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { Session } from "@pixis/schemas";
import { getStatusInfo } from "../utils/session.utils";

export const SessionCard = ({ session }: { session: Session }) => {
  const { info, isFinished, isCancelled } = getStatusInfo(session);

  return (
    <div className=" border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
      <div className="flex items-start justify-between">
        {/* Left Side */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${info.bg} ${info.color}`}
            >
              <info.icon className="size-4" />
              {info.label}
            </div>
          </div>

          <div className="mt-1 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div>
              Mode:{" "}
              <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {session.mode}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Status & Time */}
        <div className="text-right flex flex-col gap-4 ">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {format(new Date(session.createdAt), "MMM d, yyyy • h:mm a")}
          </div>
          {isFinished && session.finishedAt && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Finished
              <br />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {format(new Date(session.finishedAt), "h:mm a")}
              </span>
            </div>
          )}

          {isCancelled && session.cancelledAt && (
            <div className="text-xs text-red-500">Cancelled</div>
          )}
        </div>
      </div>
    </div>
  );
};
