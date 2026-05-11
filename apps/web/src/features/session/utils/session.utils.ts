import type { Session } from "@pixis/schemas";
import { CircleStop, Trophy, XCircle } from "lucide-react";

export const getStatusInfo = (session: Session) => {
  const isCompleted = session.status === "completed";
  const isIncomplete = session.status === "incomplete";

  const stoppedAt = new Date(session.stoppedAt ?? new Date()).getTime();
  const startedAt = new Date(session.startedAt).getTime();
  const duration = stoppedAt - startedAt;

  if (isIncomplete) {
    return {
      isIncomplete,
      isCompleted,
      duration,
      info: {
        label: "Incomplete",
        color: "text-red-500",
        bg: "bg-red-100 dark:bg-red-950",
        icon: XCircle,
      },
    };
  }

  if (isCompleted) {
    return {
      isIncomplete,
      isCompleted,
      duration,
      info: {
        label: "Completed",
        color: "text-emerald-500",
        bg: "bg-emerald-100 dark:bg-emerald-950",
        icon: Trophy,
      },
    };
  }

  return {
    isIncomplete,
    isCompleted,
    duration,
    info: {
      label: "Idle",
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-950",
      icon: CircleStop,
    },
  };
};
