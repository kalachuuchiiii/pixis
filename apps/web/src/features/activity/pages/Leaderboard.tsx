import clsx from "clsx";
import { Crown, Medal, Trophy } from "lucide-react";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { useLeaderboardDetails } from "../../leaderboards/hooks/useLeaderboardDetails";
import { LeaderboardHeader } from "@/features/leaderboards/components/LeaderboardHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  username: string;
  nickname: string;
  currentPoints: number;
  decksStudiedCount: number;
  accuracy: number | null;
}

// ─── RankCell ─────────────────────────────────────────────────────────────────

interface RankCellProps {
  rank: number;
}

const RankCell = ({ rank }: RankCellProps) => {
  if (rank === 1) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <Crown
          size={18}
          className="text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]"
        />
        <span className="font-mono text-[11px] font-bold text-amber-400">
          1
        </span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <Medal size={17} className="text-zinc-400 fill-zinc-400" />
        <span className="font-mono text-[11px] font-bold text-zinc-400">2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <Medal size={17} className="text-amber-700 fill-amber-700" />
        <span className="font-mono text-[11px] font-bold text-amber-700">
          3
        </span>
      </div>
    );
  }
  return (
    <span className="font-mono text-[15px] font-medium text-zinc-500 dark:text-zinc-500">
      {rank}
    </span>
  );
};

// ─── PlayerAvatar ─────────────────────────────────────────────────────────────

interface PlayerAvatarProps {
  username: string;
  rank: number;
}

const PlayerAvatar = ({ username, rank }: PlayerAvatarProps) => {
  const initial = username[0].toUpperCase();

  const avatarClass = clsx(
    "w-9 h-9 rounded-[10px] flex items-center justify-center text-sm font-bold flex-shrink-0",
    rank === 1 && "bg-amber-300 text-amber-900",
    rank === 2 && "bg-zinc-300 text-zinc-800",
    rank === 3 &&
      "bg-amber-600/30 text-amber-700 dark:bg-amber-700/30 dark:text-amber-400",
    rank > 3 &&
      "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
  );

  return <div className={avatarClass}>{initial}</div>;
};

// ─── AccuracyBadge ────────────────────────────────────────────────────────────

interface AccuracyBadgeProps {
  accuracy: number | null;
}

const AccuracyBadge = ({ accuracy }: AccuracyBadgeProps) => {
  const value = accuracy ?? 0;

  const colorClass = clsx(
    "font-mono text-[13px] font-medium",
    value >= 90 && "text-emerald-500 dark:text-emerald-400",
    value >= 75 && value < 90 && "text-amber-500 dark:text-amber-400",
    value < 75 && "text-red-500 dark:text-red-400"
  );

  return <span className={colorClass}>{value.toFixed(2)}%</span>;
};

// ─── LeaderboardRow ───────────────────────────────────────────────────────────

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

const LeaderboardRow = ({ entry, isCurrentUser }: LeaderboardRowProps) => {
  const rowClass = clsx(
    "grid items-center gap-0 px-5 py-4 transition-colors duration-150",
    "grid-cols-[52px_1fr_110px_80px_90px]",
    "sm:grid-cols-[52px_1fr_110px_80px_90px]",
    "max-sm:grid-cols-[44px_1fr_90px_60px]",
    entry.rank === 1 &&
      "bg-gradient-to-r from-amber-400/[0.07] via-transparent to-transparent",
    entry.rank === 2 &&
      "bg-gradient-to-r from-zinc-400/[0.06] via-transparent to-transparent",
    entry.rank === 3 &&
      "bg-gradient-to-r from-amber-600/[0.06] via-transparent to-transparent",
    entry.rank > 3 && "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
    isCurrentUser && "ring-[1.5px] ring-inset ring-amber-400/60 rounded-md"
  );

  return (
    <div
      className={clsx(
        rowClass,
        "border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center">
        <RankCell rank={entry.rank} />
      </div>

      {/* Student */}
      <div className="flex items-center gap-3">
        <PlayerAvatar username={entry.username} rank={entry.rank} />
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {entry.username}
          </span>
          {isCurrentUser && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-700/40">
              You
            </span>
          )}
        </div>
      </div>

      {/* Points */}
      <div className="flex items-center justify-center gap-1">
        <span className="font-mono text-[16px] font-medium text-zinc-900 dark:text-zinc-100">
          {entry.currentPoints.toLocaleString()}
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          pts
        </span>
      </div>

      {/* Decks */}
      <div className="flex items-center justify-center">
        <span className="font-mono text-[14px] text-zinc-500 dark:text-zinc-400">
          {entry.decksStudiedCount}
        </span>
      </div>

      {/* Accuracy — hidden on mobile */}
      <div className="hidden sm:flex items-center justify-center">
        <AccuracyBadge accuracy={entry.accuracy} />
      </div>
    </div>
  );
};

// ─── LeaderboardTable ─────────────────────────────────────────────────────────

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUsername?: string;
}

const COLUMNS = [
  { label: "Rank", colClass: "col-span-1 text-center" },
  { label: "Student", colClass: "text-left pl-1" },
  { label: "Points", colClass: "text-center ml-6" },
  { label: "Decks Studied", colClass: "text-center" },
  { label: "Accuracy", colClass: "text-center hidden sm:block" },
] as const;

const LeaderboardTable = ({
  entries,
  currentUsername,
}: LeaderboardTableProps) => {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      {/* Table Head */}
      <div className="grid grid-cols-[52px_1fr_110px_80px_90px] max-sm:grid-cols-[44px_1fr_90px_60px] px-5 py-3 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        {COLUMNS.map(({ label, colClass }) => (
          <div
            key={label}
            className={clsx(
              "text-[10px] font-bold tracking-[.12em] uppercase text-zinc-400 dark:text-zinc-500 flex items-center",
              colClass
            )}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="bg-white dark:bg-zinc-950">
        {entries.map((entry) => (
          <LeaderboardRow
            key={entry.rank}
            entry={entry}
            isCurrentUser={entry.username === currentUsername}
          />
        ))}
      </div>
    </div>
  );
};

// ─── LeaderboardHeader ────────────────────────────────────────────────────────

// ─── LeaderboardPage (default export) ────────────────────────────────────────

const LeaderboardPage = () => {
  const { data: user } = useProfileDetails();
  const { data: topGlobalUsers } = useLeaderboardDetails();

  return (
    <div className="page-container">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <LeaderboardHeader />

        <LeaderboardTable
          entries={topGlobalUsers}
          currentUsername={user?.username}
        />

        <p className="text-center mt-8 text-[12px] text-zinc-400 dark:text-zinc-500">
          Points are earned through consistent studying, high accuracy, and
          completing decks.
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;

// ─── Named exports for reuse ──────────────────────────────────────────────────

export {
  RankCell,
  PlayerAvatar,
  AccuracyBadge,
  LeaderboardRow,
  LeaderboardTable,
  LeaderboardHeader,
};
