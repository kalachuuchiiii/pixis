import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PopupProvider } from "@/components/ui/PopupProvider";
import { Suspense, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useDarkMode } from "@/features/account/hooks/useDarkMode";

function App() {
  const theme = useDarkMode((state) => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

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
