import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PopupProvider } from "@/components/ui/PopupProvider";

function App() {
  return (
    <div className="overflow-x-hidden">
      <PopupProvider />
      <TooltipProvider>
        <Toaster position="top-center" />
        <AppRouter />
      </TooltipProvider>
    </div>
  );
}

export default App;
