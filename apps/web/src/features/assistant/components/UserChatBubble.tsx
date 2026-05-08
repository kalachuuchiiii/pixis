import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { ChatMessage } from "@pixis/schemas";
import pixis from "/pixis.gif";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Astroid } from "lucide-react";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { UserBadge } from "@/features/account/components/ui/UserBadge";

export const UserChatBubble = ({
  message,
}: {
  message: ChatMessage & { role: "user" };
}) => {
  const { data: user } = useProfileDetails();

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
          </Card>
        </div>
      </div>{" "}
      <UserBadge className="mb-2" user={user}>
        <UserBadge.Avatar />
      </UserBadge>
    </div>
  );
};
