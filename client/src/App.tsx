import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Desktop } from "@/components/os/Desktop";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Desktop />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
