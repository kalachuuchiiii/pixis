import AppErrorBoundary from "@/app/AppErrorBoundary";
import { Topbar } from "@/components/ui/AppLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useProfileDetails } from "@/features/account/hooks/useProfileDetails";
import { Outlet } from "react-router-dom";
import { AssistantSidebar } from "./AssistantSidebar";

export const AssistantLayout = () => {
  const { data: user, isPending } = useProfileDetails();
  return (
    <SidebarProvider defaultOpen={true}>
      <div
        className="flex min-h-screen  w-full"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <AssistantSidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow">
          <Topbar />

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
