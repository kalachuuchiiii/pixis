import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";
import {
  BarChart2,
  BookOpen,
  BookOpenText,
  BookText,
  ChartArea,
  Layers,
  LibraryBig,
  Search,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { Pixis, PixisAvatar } from "./PixisAvatar";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const NAV_AI = [
  { label: "Chat", to: "/app/chat", icon: () => PixisAvatar({ size: 20 }) },
];

const NavItem = ({
  item,
}: {
  item: { label: string; to: string; icon: React.ElementType };
}) => {
  const location = useLocation();

  const isActive =
    location.pathname === item.to ||
    (item.to !== "/app" && location.pathname.startsWith(item.to));

  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        <NavLink
          to={item.to}
          end={item.to === "/app"}
          className={({ isActive: a }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors w-full
             ${
               a
                 ? "bg-zinc-900 text-white"
                 : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-400 hover:bg-zinc-100"
             }`
          }
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />

          <span>{item.label}</span>

          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const AppSidebar = () => {
  const { data: user } = useAuthUser();

  const NAV_LIBRARY = [
    {
      label: "My Collections",
      to: `/app/profile/${user.id}/collections`,
      icon: LibraryBig,
    },
    {
      label: "My Decks",
      to: `/app/profile/${user.id}/decks`,
      icon: Layers,
    },
  ];

  const NAV_DISCOVER = [
    {
      label: "Explore Collections",
      to: "/app/explore/collections",
      icon: BookOpen,
    },
    {
      label: "Explore Decks",
      to: "/app/explore/decks",
      icon: BookOpen,
    },
    {
      label: "Leaderboard",
      to: "/app/leaderboard",
      icon: Trophy,
    },
    {
      label: "People",
      to: "/app/people",
      icon: Search,
    },
  ];

  const NAV_PROGRESS = [
    {
      label: "Dashboard",
      to: "/app/dashboard",
      icon: BarChart2,
    },
    {
      label: "Stats",
      to: `/app/profile/${user.id}/stats`,
      icon: ChartArea,
    },
  ];

  const NAV_RESOURCES = [
    {
      label: "Study Guides",
      to: "/study",
      icon: BookOpenText,
    },
    {
      label: "Documentation",
      to: "/documentation",
      icon: BookText,
    },
  ];

  const NAV_ACCOUNT = [
    {
      label: "Profile",
      to: `/app/profile/${user.id}/stats`,
      icon: User,
    },
    {
      label: "Settings",
      to: "/app/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar
      className="border-r dark:border-zinc-800 border-zinc-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <SidebarHeader className="px-4 py-5 border-b dark:border-zinc-800 border-zinc-100">
        <div className="flex items-center gap-2.5">
          <PixisAvatar />
          <Pixis />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 flex flex-col gap-1">
        {/* AI */}
        <SidebarGroup className="mt-3">
          <SidebarGroupLabel>AI</SidebarGroupLabel>

          <SidebarMenu>
            {NAV_AI.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Library */}
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>

          <SidebarMenu>
            {NAV_LIBRARY.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Discover */}
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>

          <SidebarMenu>
            {NAV_DISCOVER.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Progress */}
        <SidebarGroup>
          <SidebarGroupLabel>Progress</SidebarGroupLabel>

          <SidebarMenu>
            {NAV_PROGRESS.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Resources */}
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>

          <SidebarMenu>
            {NAV_RESOURCES.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 py-3 dark:border-zinc-800 border-t border-zinc-100">
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>

          <SidebarMenu>
            {NAV_ACCOUNT.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <UserBadge.Default user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
