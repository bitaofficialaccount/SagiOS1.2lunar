import { Map, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapsProps {
  onBack: () => void;
}

export function Maps({ onBack }: MapsProps) {
  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <Map className="w-8 h-8 text-green-400" />
        <h1 className="text-3xl font-bold">Maps</h1>
      </div>

      <div className="flex-1 px-6 pb-20 flex flex-col items-center justify-center">
        <Map className="w-24 h-24 text-green-400 opacity-50 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your Location</h2>
        <p className="text-muted-foreground mb-6 text-center">Seattle, WA 98101</p>
        
        <div className="w-full space-y-3">
          <Button className="w-full" onClick={() => {}}>
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Button variant="secondary" className="w-full">
            Nearby Places
          </Button>
        </div>
      </div>
    </div>
  );
}
