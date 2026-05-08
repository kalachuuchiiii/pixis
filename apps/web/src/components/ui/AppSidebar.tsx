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
  Gift,
  Home,
  Layers,
  LibraryBig,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { Pixis, PixisAvatar } from "./PixisAvatar";
import { UserBadge } from "@/features/account/components/ui/UserBadge";

const NAV_SUPER_PRIMARY = [
  { label: "Chat", to: "/app/chat", icon: () => PixisAvatar({ size: 20 }) },
];

const NAV_PRIMARY = [
  {
    label: "My Collections",
    to: "/app/collections",
    icon: LibraryBig,
  },
  { label: "My Decks", to: "/app/decks", icon: Layers },
  { label: "Dashboard", to: "/app/dashboard", icon: BarChart2 },
];

const NAV_SOCIAL = [
  {
    label: "Explore Collections",
    to: "/app/explore/collections",
    icon: BookOpen,
  },
  { label: "Explore Decks", to: "/app/explore/decks", icon: BookOpen },

  { label: "Leaderboard", to: "/app/leaderboard", icon: Trophy },
];

const NAV_SYSTEM = [
  { label: "Profile", to: "/app/profile", icon: User },
  { label: "Settings", to: "/app/settings", icon: Settings },
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
                 ? "bg-zinc-900  text-white"
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
  const { data: user } = useProfileDetails();
  return (
    <Sidebar
      className="border-r dark:border-zinc-800 border-zinc-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header — brand */}
      <SidebarHeader className="px-4 py-5 border-b dark:border-zinc-800 border-zinc-100">
        <div className="flex items-center gap-2.5">
          <PixisAvatar />
          <Pixis />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 flex flex-col gap-1">
        {/* Primary — core study actions */}
        {/* Social — community & competition */}

        <SidebarGroup className="mt-3">
          <SidebarGroupLabel>Assistant</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_SUPER_PRIMARY.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_SOCIAL.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Study</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_PRIMARY.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — account / system (least frequent, bottom) */}
      <SidebarFooter className="px-3 py-3 dark:border-zinc-800 border-t border-zinc-100">
        <SidebarMenu>
          {NAV_SYSTEM.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </SidebarMenu>

        {/* Mini user card in footer */}
        <UserBadge.Default user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
