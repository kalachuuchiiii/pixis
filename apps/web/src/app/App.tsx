import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PopupProvider } from "@/components/ui/PopupProvider";
import { useEffect } from "react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

function App() {
  useAuthUser();
  const mode = localStorage.getItem("theme") === "dark" ? "dark" : "light";

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      return;
    }
    document.documentElement.classList.remove("dark");
  }, [mode]);

  return (
    <div>
      <PopupProvider />
      <TooltipProvider>
        <Toaster position="top-center" />
        <AppRouter />
      </TooltipProvider>
    </div>
  );
}

export default App;
