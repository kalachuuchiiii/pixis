import { Clock, Trophy, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { Session } from "@pixis/schemas";
import { getStatusInfo } from "../utils/session.utils";
import { formatMs } from "@/utils/formatMs";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const SessionCard = ({ session }: { session: Session }) => {
  const { info, duration } = getStatusInfo(session);

  return (
    <div className=" border border-zinc-200 bg-neutral-50 dark:bg-zinc-900 dark:border-zinc-700 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
      <div className="flex items-start justify-between h-full">
        {/* Left Side */}
        <div className=" flex flex-col   justify-between h-full space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${info.bg} ${info.color}`}
            >
              <info.icon className="size-4" />
              {info.label}
            </div>
          </div>
          <div className="space-x-2">
            <span className="text-emerald-600 ">
              <span className="font-bold">
                {" "}
                {session.totalPointsGained.toFixed(2)}{" "}
              </span>
              <span className="text-xs">pts</span>
            </span>
            <p className="w-full">
              <span className=" font-bold">{session.accuracy.toFixed(2)}%</span>{" "}
              <span className="text-xs">Accuracy</span>
            </p>
          </div>
        </div>
        {/* Right Side - Status & Time */}
        <Separator orientation="vertical" />
        <div className="text-right  justify-center  text-zinc-500 dark:text-zinc-400 h-full flex flex-col ">
          <div className="text-xs h-full flex flex-col justify-between ">
            <p>{format(new Date(session.startedAt), "MMM d, yyyy • h:mm a")}</p>
            <span className="tracking-tight lg:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {session.mode}
            </span>
            {session.status !== "idle" ? (
              <p> Duration: {formatMs(duration)}</p>
            ) : (
              <Link
                to={`/app/exam/${session.mode.toLowerCase()}/${session.id}`}
              >
                <Button variant={"outline"}>Continue</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
