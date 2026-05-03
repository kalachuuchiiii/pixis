import type { TopDeckUser } from "@pixis/schemas";

export const UserLeaderboardDisplay = ({
  user,
  index,
}: {
  user: TopDeckUser;
  index: number;
}) => {
  const isFirst = index === 0;
  const isSecond = index === 1;
  const isThird = index === 2;
  const initials = user.nickname?.slice(0, 2).toUpperCase() || "??";

  return (
    <div
      key={user.username}
      className={`
                relative flex items-center gap-4 px-5 py-4 
                border rounded-2xl transition-all hover:shadow-md
                ${isFirst ? "border-amber-500/50 bg-amber-50 dark:bg-amber-950/30" : ""}
                ${isSecond ? "border-zinc-400" : ""}
                ${isThird ? "border-orange-600/40" : "border-zinc-200 dark:border-zinc-700"}
              `}
    >
      {isFirst && <span className="absolute -top-2 right-4 text-2xl">👑</span>}
      <div
        className={`w-6 text-center font-semibold flex-shrink-0
                  ${isFirst ? "text-amber-500" : ""}
                  ${isSecond ? "text-zinc-400" : ""}
                  ${isThird ? "text-orange-700" : "text-zinc-500"}
                `}
      >
        {index + 1}
      </div>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 overflow-hidden
                  ${isFirst ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" : ""}
                  ${isSecond ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" : ""}
                  ${isThird ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" : ""}
                  ${!isFirst && !isSecond && !isThird ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" : ""}
                `}
      >
        {user.avatarPublicUrl ? (
          <img
            src={user.avatarPublicUrl}
            alt={user.nickname}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {user.nickname || user.username}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          @{user.username}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
          {user.deckPoints.toLocaleString()}
        </p>
        <p className="text-xs text-zinc-500">pts</p>
      </div>
    </div>
  );
};
