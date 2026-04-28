import { Outlet, NavLink, useLocation } from "react-router-dom";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  User,
  Layers,
  Trophy,
  Settings,
  BarChart2,
  Bell,
  Flame,
  Zap,
  LogOut,
  BookOpen,
  CheckCircle2,
  Gift,
  LibraryBig,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { useEffect } from "react";
import { getMe } from "@/features/account/slice/profileSlice";
import { useAppSelector } from "@/hooks/useReduxHook";
import AppErrorBoundary from "@/app/AppErrorBoundary";
import { Pixis, PixisAvatar } from "./PixisAvatar";

// ── Hardcoded user data ────────────────────────────────────────────────────

const NOTIFICATIONS = [
  {
    id: 1,
    icon: <Trophy size={13} className="text-amber-500" />,
    bg: "bg-amber-50",
    title: "New badge earned!",
    desc: 'You unlocked "Week Warrior" 🔥',
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    icon: <Layers size={13} className="text-sky-500" />,
    bg: "bg-sky-50",
    title: "Deck shared with you",
    desc: 'alex_k shared "Bio 101" with you',
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    icon: <BarChart2 size={13} className="text-violet-500" />,
    bg: "bg-violet-50",
    title: "Weekly report ready",
    desc: "Your study summary is here",
    time: "3h ago",
    unread: false,
  },
  {
    id: 4,
    icon: <CheckCircle2 size={13} className="text-green-500" />,
    bg: "bg-green-50",
    title: "Deck mastered!",
    desc: 'You completed "Cell Biology"',
    time: "1d ago",
    unread: false,
  },
  {
    id: 5,
    icon: <Gift size={13} className="text-rose-400" />,
    bg: "bg-rose-50",
    title: "Streak milestone",
    desc: "14-day streak! Keep it up 💪",
    time: "1d ago",
    unread: false,
  },
];

const NAV_PRIMARY = [
  { label: "Home", to: "/app", icon: Home },
  { label: "My Decks", to: "/app/decks", icon: Layers },
  {
    label: "My Collections",
    to: "/app/collections",
    icon: LibraryBig,
  },
  { label: "Activity", to: "/app/activity", icon: BarChart2 },
];

const NAV_SOCIAL = [
  { label: "Leaderboard", to: "/app/leaderboard", icon: Trophy },
  { label: "Public Decks", to: "/app/explore", icon: BookOpen },
];

const NAV_SYSTEM = [
  { label: "Profile", to: "/app/profile", icon: User },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

// ── Brand ──────────────────────────────────────────────────────────────────
const BoltIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ── Sidebar Nav Item ───────────────────────────────────────────────────────
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
                 ? "bg-stone-900  text-white"
                 : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-400 hover:bg-stone-100"
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

// ── App Sidebar ────────────────────────────────────────────────────────────
const AppSidebar = () => {
  const { user } = useAppSelector((state) => state.profile);

  return (
    <Sidebar
      className="border-r dark:border-stone-800 border-stone-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header — brand */}
      <SidebarHeader className="px-4 py-5 border-b dark:border-stone-800 border-stone-100">
        <div className="flex items-center gap-2.5">
          <PixisAvatar />
          <Pixis/>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 flex flex-col gap-1">
        {/* Primary — core study actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold tracking-[0.14em] uppercase dark:text-stone-200 text-stone-300 px-3 mb-1">
            Study
          </SidebarGroupLabel>
          <SidebarMenu>
            {NAV_PRIMARY.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Social — community & competition */}
        <SidebarGroup className="mt-3">
          <SidebarGroupLabel className="text-[10px] font-semibold tracking-[0.14em] uppercase text-stone-300 px-3 mb-1">
            Community
          </SidebarGroupLabel>
          <SidebarMenu>
            {NAV_SOCIAL.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — account / system (least frequent, bottom) */}
      <SidebarFooter className="px-3 py-3 dark:border-stone-800 border-t border-stone-100">
        <SidebarMenu>
          {NAV_SYSTEM.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </SidebarMenu>

        {/* Mini user card in footer */}
        <UserBadge className="flex items-center gap-3 p-2" user={user}>
          <UserBadge.Avatar />
          <UserBadge.Info />
        </UserBadge>
      </SidebarFooter>
    </Sidebar>
  );
};

const NotificationDropdown = () => {
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors outline-none"
          aria-label="Notifications"
        >
          <Bell size={17} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-red-500 border-2 border-white" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[320px] p-0 rounded-2xl border border-stone-200 shadow-lg overflow-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <DropdownMenuLabel className="px-4 py-3.5 border-b border-stone-100 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-stone-900">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="text-[11px] font-semibold text-stone-400">
              {unreadCount} new
            </span>
          )}
        </DropdownMenuLabel>

        <div className="max-h-[340px] overflow-y-auto">
          {NOTIFICATIONS.map((n, i) => (
            <div key={n.id}>
              <DropdownMenuItem className="px-4 py-3 cursor-pointer focus:bg-stone-50 rounded-none gap-3">
                <div
                  className={`w-7 h-7 rounded-lg ${n.bg} flex items-center justify-center flex-shrink-0`}
                >
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12.5px] font-semibold text-stone-800 leading-tight">
                      {n.title}
                    </p>
                    {n.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[12px] text-stone-400 leading-snug mt-0.5 truncate">
                    {n.desc}
                  </p>
                  <p className="text-[11px] text-stone-300 mt-1">{n.time}</p>
                </div>
              </DropdownMenuItem>
              {i < NOTIFICATIONS.length - 1 && (
                <DropdownMenuSeparator className="my-0 bg-stone-50" />
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-stone-100 px-4 py-2.5">
          <button className="text-[12px] font-medium text-stone-400 hover:text-stone-700 transition-colors w-full text-center">
            Mark all as read
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ── Top Navbar ─────────────────────────────────────────────────────────────
const Topbar = () => {
  const { user } = useAppSelector((state) => state.profile);

  return (
    <header
      className="h-[60px] border-b border-stone-100 dark:border-stone-800 s backdrop-blur-md flex items-center justify-between px-5 gap-4 sticky top-0 z-40"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Left: hamburger trigger (mobile / collapse) */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="w-8 h-8 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors flex items-center justify-center" />
      </div>

      {/* Right: stats + notifications + user */}
      <motion.div layout className="flex items-center gap-3">
        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
          <Flame size={14} className="text-amber-500" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-amber-700">
            {user.streak.currentStreak}
          </span>
          <span className="text-[11px] text-amber-400 hidden md:inline">
            streak
          </span>
        </div>

        {/* Points */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100">
          <Zap
            size={13}
            className="text-stone-500"
            strokeWidth={2}
            fill="currentColor"
          />
          <span className="text-[13px] font-semibold text-stone-700">
            {user.point.currentPoints}
          </span>
          <span className="text-[11px] text-stone-400 hidden md:inline">
            pts
          </span>
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User pill */}
        <UserBadge className="flex items-center gap-3 " user={user}>
          <UserBadge.Avatar />
          <UserBadge.Info />
        </UserBadge>
      </motion.div>
    </header>
  );
};

// ── App Layout ─────────────────────────────────────────────────────────────
const AppLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isFetching } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <SidebarProvider  defaultOpen={true}>
      <div
        className="flex min-h-screen  w-full"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <AppSidebar />

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 overflow">
          <Topbar />

          {/* Page content */}
          <AppErrorBoundary>
            <main className="flex-1  max-w-7xl w-full p-6">
              {!isFetching && <Outlet />}
            </main>
          </AppErrorBoundary>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
