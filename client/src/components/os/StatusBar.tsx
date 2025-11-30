import { useState, useEffect } from "react";
import { Wifi, Battery, Volume2, Cloud } from "lucide-react";

export function StatusBar() {
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
        if (import.meta.env.DEV) {
          console.error("Failed to fetch weather:", err);
        }
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
    <div className="flex items-center justify-center px-4 py-2 bg-transparent absolute top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
      </div>
    </div>
  );
}
