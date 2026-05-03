import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppErrorBoundary from "./AppErrorBoundary";

function App() {
  return (
    <div className="overflow-x-hidden">
      <TooltipProvider>
        <Toaster position="top-center" />
        <AppRouter />
      </TooltipProvider>
    </div>
  );
}

export default App;
