import { useState, useEffect } from "react";
import { Menu, Wifi, Battery, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusBarProps {
  onMenuClick: () => void;
  weather?: { temp: number; condition: string };
}

export function StatusBar({ onMenuClick, weather }: StatusBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-transparent absolute top-0 left-0 right-0 z-50">
      <Button
        size="icon"
        variant="ghost"
        className="w-12 h-12 rounded-full"
        onClick={onMenuClick}
        data-testid="button-menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <div className="flex items-center gap-4">
        {weather && (
          <div className="flex items-center gap-2 text-sm">
            <span>{weather.condition}</span>
            <span className="font-medium">{weather.temp}°</span>
          </div>
        )}
        <span className="text-lg font-medium" data-testid="text-status-time">
          {formatTime(time)}
        </span>
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 opacity-80" />
          <Volume2 className="w-5 h-5 opacity-80" />
          <Battery className="w-5 h-5 opacity-80" />
        </div>
      </div>
    </div>
  );
}
