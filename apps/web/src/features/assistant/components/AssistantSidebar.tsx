import { Pixis, PixisAvatar } from "@/components/ui/PixisAvatar";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { Home, Plus, Search, Trash } from "lucide-react";
import { useAssistantConversations } from "../hooks/useAssistantConversations";
import { NavLink } from "react-router-dom";
import { useAssistant } from "../hooks/useAssistant";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AssistantSidebar = () => {
  const { data: user } = useProfileDetails();
  const { data: conversations = [] } = useAssistantConversations();
  const { deleteConversation, isDeletingConversation } = useAssistant();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5 border-b dark:border-zinc-800 border-zinc-100">
        <div className="flex items-center gap-2.5">
          <PixisAvatar />
          <Pixis />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-3 flex flex-col gap-1">
        {/* Primary — core study actions */}
        {/* Social — community & competition */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton>
              {" "}
              <NavLink
                className={"flex items-center gap-2 w-full"}
                to={`/app/decks`}
              >
                <Home /> Home
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuButton>
              {" "}
              <NavLink
                className={"flex items-center gap-2 w-full"}
                to={`/app/chat`}
              >
                <Plus /> New Chat
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenu>

          <Separator className="my-4" />
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          {conversations.map((c) => (
            <SidebarMenu>
              <SidebarMenuButton>
                <NavLink className={"w-full h-full "} to={`/app/chat/${c.id}`}>
                  {c.title || "Untitled"}
                </NavLink>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant={"ghost"}
                      className="opacity-10 hover:opacity-100 hover:text-red-500"
                    >
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This cannot be undone
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <main className="flex items-center justify-end gap-1">
                      <AlertDialogCancel variant={"outline"} className="my-btn">
                        keep this conversation
                      </AlertDialogCancel>
                      <AlertDialogCancel
                        disabled={isDeletingConversation}
                        onClick={() => deleteConversation({ id: c.id })}
                        variant={"destructive"}
                        className="my-btn"
                      >
                        Delete
                      </AlertDialogCancel>
                    </main>
                  </AlertDialogContent>
                </AlertDialog>
              </SidebarMenuButton>
            </SidebarMenu>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 dark:border-zinc-800 border-t border-zinc-100">
        <UserBadge.Default user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
