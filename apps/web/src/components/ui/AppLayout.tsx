import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { UserBadge } from "@/features/account/components/ui/UserBadge";
import AppErrorBoundary from "@/app/AppErrorBoundary";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "./separator";
import streak from "/streak-fire.gif";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import point from "/point.gif";

export const Topbar = () => {
  const { data: user } = useAuthUser();

  return (
    <header
      className="h-[60px] border-b border-zinc-100 dark:border-zinc-800 s backdrop-blur-md flex items-center justify-between px-5 gap-4 sticky  top-0 z-40"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger className="w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors flex items-center justify-center" />
      </div>

      <motion.div layout className="flex items-center gap-6">
        {/* Streak */}

        <div className="flex items-center gap-4">
          <div className=" flex items-center gap-1 ">
            <img src={streak} className="lg:size-8 mb-1" />
            <p>
              <span className="lg:text-base c text-xs tracking-tighter text-zinc-700 dark:text-neutral-100">
                {user.streak.currentStreak}
              </span>{" "}
            </p>
          </div>

          <div className=" flex items-center gap-1">
            <img src={point} className="lg:size-8" />
            <span className="lg:text-base text-xs  tracking-tighter text-zinc-700 dark:text-neutral-100">
              {user.point.currentPoints}
            </span>
          </div>
        </div>
        {/* User pill */}
        <UserBadge.Default user={user} />
      </motion.div>
    </header>
  );
};

const AppLayout = () => {
  const { isPending } = useAuthUser();

  return (
    <SidebarProvider open={true} defaultOpen={true}>
      <div className="flex min-h-screen h-full w-full">
        <AppSidebar />

        {/* Main column */}
        <div className=" w-full min-h-screen min-w-0 ">
          <Topbar />

          {/* Page content */}
          <AppErrorBoundary>
            <main className="flex-1  max-w-7xl w-full p-6">
              {!isPending && <Outlet />}

              <Separator orientation="vertical" />
            </main>
          </AppErrorBoundary>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
