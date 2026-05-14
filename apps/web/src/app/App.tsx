import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PopupProvider } from "@/components/ui/PopupProvider";
import { Suspense, useEffect } from "react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="relative">
      <PopupProvider />
      <TooltipProvider>
        <Toaster position="top-center" />
        <Suspense
          fallback={
            <div className="fixed inset-0  flex items-center justify-center w-full h-full">
              <Spinner />
            </div>
          }
        >
          <AppRouter />
        </Suspense>
      </TooltipProvider>
    </div>
  );
}

export default App;
