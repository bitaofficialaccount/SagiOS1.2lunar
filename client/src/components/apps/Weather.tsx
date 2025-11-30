import { ArrowLeft, Cloud, Sun, Wind, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherProps {
  onBack: () => void;
}

export function Weather({ onBack }: WeatherProps) {
  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full"
          onClick={onBack}
          data-testid="button-back-weather"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold">Weather</h1>
      </div>

      <div className="flex-1 px-6 pb-20">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl p-8 border border-border/50 mb-6">
          <p className="text-muted-foreground mb-2">Seattle, WA</p>
          <div className="flex items-center gap-6 mb-6">
            <Sun className="w-24 h-24 text-yellow-400" />
            <div>
              <p className="text-6xl font-light">72°</p>
              <p className="text-xl text-muted-foreground">Sunny</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
              <Wind className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="font-semibold">12 mph</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
              <Droplets className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-semibold">65%</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Hourly Forecast</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((hour) => (
            <div key={hour} className="flex-shrink-0 bg-card/40 rounded-xl p-4 border border-border/50 text-center min-w-24">
              <p className="text-sm text-muted-foreground mb-2">{12 + hour}:00</p>
              <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <p className="font-semibold">{70 + hour}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
