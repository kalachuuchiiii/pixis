import { toOrdinal } from "@/utils/toOrdinal";
import type { TopUser } from "@pixis/schemas";
import { getRankIcon } from "./Leaderboard";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { Skeleton } from "boneyard-js/react";

export const TopUserRow = ({ user }: { user: TopUser }) => {
  const isLoading = !user.id;
  return (
    <tr
      key={user.username}
      className="hover:opacity-50 w-full dark:text-neutral-100 text-zinc-900 transition-colors"
    >
      <td className=" p-1 py-2 lg:p-6">
        <Skeleton loading={isLoading} name="rank">
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono lg:text-sm text-xs  font-medium">
              {toOrdinal(user.rank)}
            </span>
            {getRankIcon(user.rank)}
          </div>
        </Skeleton>
      </td>
      <td className="p-1 py-2 w-full lg:p-6 text-xs truncate lg:text-base font-medium">
        <div className="w-fit">
          <UserBadge.Default
            user={{
              username: user.username,
              id: user.id,
              nickname: user.nickname,
              avatarUrl: user.avatarUrl,
            }}
          />
        </div>
      </td>
      <td className="p-1 py-2 lg:p-6 lg:text-base text-xs text-center tabular-nums text-emerald-400">
        <Skeleton loading={isLoading} name="accuracy">
          <p className="w-fit ">{user.averageAccuracy.toFixed(2)}%</p>
        </Skeleton>
      </td>
      <td className="p-1 py-2 lg:p-6 lg:text-base text-xs text-center font-semibold tabular-nums">
        <Skeleton loading={isLoading} name="points">
          <p className=" min-w-12 "> {user.points.toLocaleString()}</p>
        </Skeleton>
      </td>
    </tr>
  );
};
