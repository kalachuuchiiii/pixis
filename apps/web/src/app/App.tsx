

import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {


  return (
    <>
      <div>
        <TooltipProvider>
          <Toaster position="top-center" />
        <AppRouter />
        </TooltipProvider>
      </div>
    </>
  );
}

export default App;
