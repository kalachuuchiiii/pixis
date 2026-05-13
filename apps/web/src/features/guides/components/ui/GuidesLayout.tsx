import { Pixis, PixisAvatar } from "@/components/ui/PixisAvatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { studyTechniqueOptions } from "../../data/studyTechniques";
import { useEffect } from "react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export const GuidesLayout = () => {
  const { data: user } = useAuthUser();

  const location = useLocation();
  const id = location.hash.slice(1);

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location.hash]);

  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="px-4 py-5 border-b dark:border-zinc-800 border-zinc-100">
            <div className="flex items-center gap-2.5">
              <PixisAvatar />
              <Pixis />
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-3  flex flex-col gap-1">
            <SidebarGroup>
              <SidebarMenu>
                <SidebarGroupLabel>App</SidebarGroupLabel>
                <SidebarMenuItem className="">
                  {user.id && user.username ? (
                    <NavLink to={`/app/profile/${user.id}/decks`}>
                      <SidebarMenuButton className="px-5">
                        Home
                      </SidebarMenuButton>
                    </NavLink>
                  ) : (
                    <NavLink to={"/"}>
                      <SidebarMenuButton className="px-5">
                        Pixis
                      </SidebarMenuButton>
                    </NavLink>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Guides</SidebarGroupLabel>
              <SidebarMenu className="space-y-2">
                <NavLink
                  to={`/documentation`}
                  className={({ isActive }) =>
                    `${isActive ? "border-l-sky-400 dark:border-l-yellow-400" : ""} px-3 h-full  border-l-1`
                  }
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton>Documentation</SidebarMenuButton>
                  </SidebarMenuItem>
                </NavLink>
                <NavLink
                  to={`/study`}
                  className={({ isActive }) =>
                    `${isActive ? "border-l-sky-400 dark:border-l-yellow-400" : ""} px-3 h-full  border-l-1`
                  }
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton>Study techniques</SidebarMenuButton>
                    <div className="ml-2 my-2 flex flex-col ">
                      {studyTechniqueOptions.map((opt) => (
                        <NavLink
                          to={`/study#${opt.id}`}
                          className={() =>
                            `${opt.id === id ? "brightness-100 border-l-sky-300 dark:border-l-amber-200/50" : "brightness-50 "} border-l-1 px-4  text-sm py-1 `
                          }
                        >
                          {opt.name}
                        </NavLink>
                      ))}
                    </div>
                  </SidebarMenuItem>
                </NavLink>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="max-w-7xl lg:p-10">
          <SidebarTrigger />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
};
