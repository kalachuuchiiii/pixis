import type { Session } from "@pixis/schemas";
import { Clock, Trophy, XCircle } from "lucide-react";

export const getStatusInfo = (session: Session) => {
  const isFinished = !!session.finishedAt;
  const isCancelled = !!session.cancelledAt;

  if (isCancelled) {
    return {
      isCancelled,
      isFinished,
      info: {
        label: "Cancelled",
        color: "text-red-500",
        bg: "bg-red-100 dark:bg-red-950",
        icon: XCircle,
      },
    };
  }
  return {
    isCancelled,
    isFinished,
    info: {
      label: "Completed",
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-950",
      icon: Trophy,
    },
  };
};
