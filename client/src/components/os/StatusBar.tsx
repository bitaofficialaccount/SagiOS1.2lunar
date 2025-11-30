import { useState, useEffect } from "react";
import { Menu, Wifi, Battery, Volume2, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusBarProps {
  onMenuClick: () => void;
}

export function StatusBar({ onMenuClick }: StatusBarProps) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const country = localStorage.getItem("userCountry") || "US";
        const provider = localStorage.getItem("weatherProvider") || "mock";
        
        if (provider === "mock" || !import.meta.env.VITE_ACCUWEATHER_API_KEY) {
          // Use mock weather for now
          setWeather({ temp: 72, condition: "Sunny" });
        } else {
          // AccuWeather API would go here
          setWeather({ temp: 72, condition: "Sunny" });
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        setWeather({ temp: 72, condition: "Sunny" });
      }
    };

    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000); // Update every 10 minutes
    return () => clearInterval(weatherTimer);
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
            <Cloud className="w-4 h-4" />
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
