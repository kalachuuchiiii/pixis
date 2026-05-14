import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Message } from "@pixis/schemas";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { memo } from "react";

export const UserChatBubble = memo(
  ({ message }: { message: Message & { role: "user" } }) => {
    const { data: user } = useAuthUser();

    return (
      <div className="flex w-full justify-end items-end ">
        {" "}
        <div className="flex  max-w-10/12 gap-2 p-2">
          <div className="flex  flex-col gap-2">
            <header className="flex items-center justify-end px-1">
              <div className="flex w-fit gap-2 items-end">
                <label className="text-xs opacity-50">
                  {user.nickname || user.username}
                </label>
              </div>
            </header>
            <Card className="w-full dark:bg-white dark:text-zinc-900 flex flex-col items-start px-3">
              <CardTitle>{message.content}</CardTitle>
              {message.pdfName && (
                <CardDescription className="line-clamp-2 ml-2">
                  {message.pdfName}
                </CardDescription>
              )}
            </Card>
          </div>
        </div>{" "}
        <UserBadge className="mb-2" user={user}>
          <UserBadge.Avatar />
        </UserBadge>
      </div>
    );
  }
);
