import type { Session } from "@pixis/schemas";
import { Clock, Trophy, XCircle } from "lucide-react";

export const getStatusInfo = (session: Session) => {
  const isFinished = !!session.finishedAt;
  const isAbandoned = !!session.abandonedAt;
  const finishedAtDate = new Date(session.finishedAt ?? new Date()).getTime();
  const abandonedAtDate = new Date(session.abandonedAt ?? new Date()).getTime();
  const createdAtDate = new Date(session.createdAt ?? new Date()).getTime();

  if (isAbandoned) {
    return {
      isAbandoned,
      isFinished,
      duration: abandonedAtDate - createdAtDate,
      info: {
        label: "Incomplete",
        color: "text-red-500",
        bg: "bg-red-100 dark:bg-red-950",
        icon: XCircle,
      },
    };
  }
  return {
    isAbandoned,
    isFinished,
    duration: finishedAtDate - createdAtDate,
    info: {
      label: "Completed",
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-950",
      icon: Trophy,
    },
  };
};
