import { Cloud, Sun, Wind, Droplets, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WeatherProps {
  onBack: () => void;
}

const weatherData: { [key: string]: { condition: string; temp: number; wind: number; humidity: number; icon: typeof Sun } } = {
  "seattle,wa": { condition: "Sunny", temp: 72, wind: 12, humidity: 65, icon: Sun },
  "new york,ny": { condition: "Cloudy", temp: 68, wind: 15, humidity: 58, icon: Cloud },
  "los angeles,ca": { condition: "Sunny", temp: 82, wind: 8, humidity: 45, icon: Sun },
  "chicago,il": { condition: "Rainy", temp: 62, wind: 20, humidity: 75, icon: Cloud },
  "miami,fl": { condition: "Sunny", temp: 85, wind: 10, humidity: 70, icon: Sun },
  "denver,co": { condition: "Clear", temp: 75, wind: 5, humidity: 40, icon: Sun },
};

export function Weather({ onBack }: WeatherProps) {
  const [location, setLocation] = useState(() => localStorage.getItem("weatherLocation") || "seattle,wa");
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const currentWeather = weatherData[location.toLowerCase()] || {
    condition: "Unknown",
    temp: 70,
    wind: 10,
    humidity: 60,
    icon: Sun,
  };

  const handleLocationSelect = (newLocation: string) => {
    localStorage.setItem("weatherLocation", newLocation);
    setLocation(newLocation);
    setShowSearch(false);
    setSearchInput("");
  };

  const Icon = currentWeather.icon;

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center justify-between px-6 mb-6">
        <h1 className="text-3xl font-bold">Weather</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowSearch(!showSearch)}
          data-testid="button-search-location"
        >
          <MapPin className="w-5 h-5" />
        </Button>
      </div>

      {showSearch && (
        <div className="px-6 mb-6 space-y-2">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search location..."
            className="rounded-xl"
            data-testid="input-location-search"
          />
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {Object.keys(weatherData).map((loc) => (
              <Button
                key={loc}
                variant={location.toLowerCase() === loc ? "default" : "secondary"}
                size="sm"
                onClick={() => handleLocationSelect(loc)}
                data-testid={`button-location-${loc}`}
              >
                {loc.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 px-6 pb-20">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl p-8 border border-border/50 mb-6">
          <p className="text-muted-foreground mb-2 capitalize">{location}</p>
          <div className="flex items-center gap-6 mb-6">
            <Icon className="w-24 h-24 text-yellow-400" />
            <div>
              <p className="text-6xl font-light">{currentWeather.temp}°</p>
              <p className="text-xl text-muted-foreground">{currentWeather.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
              <Wind className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="font-semibold">{currentWeather.wind} mph</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl">
              <Droplets className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-semibold">{currentWeather.humidity}%</p>
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
              <p className="font-semibold">{currentWeather.temp + hour}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
