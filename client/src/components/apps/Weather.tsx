import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface WeatherProps {
  onBack: () => void;
}

export function Weather({ onBack }: WeatherProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const country = localStorage.getItem("userCountry") || "US";
  
  // Map countries to weather providers and URLs
  const getWeatherProvider = (countryCode: string) => {
    const weatherProviders: { [key: string]: { name: string; url: string } } = {
      "US": { name: "Weather.com", url: "https://weather.com/weather/today" },
      "GB": { name: "BBC Weather", url: "https://www.bbc.com/weather" },
      "CA": { name: "Environment Canada", url: "https://weather.gc.ca" },
      "AU": { name: "BOM Australia", url: "https://www.bom.gov.au" },
      "DE": { name: "Wetterzentrale", url: "https://www.wetterzentrale.de" },
      "FR": { name: "Météo-France", url: "https://www.meteo-france.com" },
      "JP": { name: "Japan Meteorological Agency", url: "https://www.jma.go.jp" },
      "IN": { name: "India Meteorological Department", url: "https://www.imd.gov.in" },
      "MX": { name: "CONAGUA", url: "https://www.conagua.gob.mx" },
      "BR": { name: "INMET Brazil", url: "https://www.inmet.gov.br" },
      "NZ": { name: "MetService", url: "https://www.metservice.com" },
      "SG": { name: "NEA Singapore", url: "https://www.nea.gov.sg" },
      "ZA": { name: "SAWS South Africa", url: "https://www.weathersa.co.za" },
    };
    return weatherProviders[countryCode] || { name: "Weather.com", url: "https://weather.com/weather/today" };
  };

  const provider = getWeatherProvider(country);
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(provider.url)}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        {onBack && (
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full shrink-0"
            onClick={onBack}
            data-testid="button-weather-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Weather</h1>
          <p className="text-xs text-muted-foreground">{provider.name} • {country}</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={proxyUrl}
          className="w-full h-full border-0"
          title="Weather"
          data-testid="iframe-weather"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
