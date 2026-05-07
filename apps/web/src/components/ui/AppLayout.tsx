import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import AppErrorBoundary from "@/app/AppErrorBoundary";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { AppSidebar } from "./AppSidebar";

const Topbar = () => {
  const { data: user } = useProfileDetails();

  return (
    <header
      className="h-[60px] border-b border-zinc-100 dark:border-zinc-800 s backdrop-blur-md flex items-center justify-between px-5 gap-4 sticky top-0 z-40"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger className="w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors flex items-center justify-center" />
      </div>

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

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100">
          <Zap
            size={13}
            className="text-zinc-500"
            strokeWidth={2}
            fill="currentColor"
          />
          <span className="text-[13px] font-semibold text-zinc-700">
            {user.point.currentPoints}
          </span>
          <span className="text-[11px] text-zinc-400 hidden md:inline">
            pts
          </span>
        </div>
        {/* User pill */}
        <UserBadge.Default user={user} />
      </motion.div>
    </header>
  );
};

const AppLayout = () => {
  const { isPending } = useProfileDetails();

  return (
    <SidebarProvider defaultOpen={true}>
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
              {!isPending && <Outlet />}
            </main>
          </AppErrorBoundary>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
