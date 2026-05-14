import type { UserBadgeWithFollowStats } from "@pixis/schemas";
import { UserBadge } from "./ui/UserBadge";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Link } from "react-router-dom";

export const ProfileCard = memo(
  ({ user }: { user: UserBadgeWithFollowStats }) => {
    const { data: authUser } = useAuthUser();
    const isMine = authUser.id === user.id;

    return (
      <div className="flex w-full p-6 lg:flex-row lg:justify-between flex-col gap-2">
        <div className="space-y-2">
          <UserBadge.Default user={user} />
          <div className="flex items-center gap-2 ">
            <span>{user.followingCount} Followings</span>
            <span>{user.followerCount} Followers</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isMine && (
            <Link to={`/app/settings`}>
              <Button className="my-btn" variant="outline">
                Update Profile
              </Button>
            </Link>
          )}
          <Link to={`/app/profile/${user.id}/stats`}>
            <Button className="my-btn">View Profile</Button>
          </Link>
        </div>
      </div>
    );
  }
);
