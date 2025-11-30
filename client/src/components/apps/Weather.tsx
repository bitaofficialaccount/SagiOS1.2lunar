import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface WeatherProps {
  onBack: () => void;
}

export function Weather({ onBack }: WeatherProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const country = localStorage.getItem("userCountry") || "US";
  
  // Map countries to weather URLs
  const getWeatherUrl = (countryCode: string) => {
    const weatherUrls: { [key: string]: string } = {
      "US": "https://weather.com/weather/today",
      "GB": "https://www.bbc.com/weather",
      "CA": "https://weather.gc.ca",
      "AU": "https://www.bom.gov.au",
      "DE": "https://www.wetterzentrale.de",
      "FR": "https://www.meteo-france.com",
      "JP": "https://www.jma.go.jp",
      "IN": "https://www.imd.gov.in",
      "MX": "https://www.conagua.gob.mx",
      "BR": "https://www.inmet.gov.br",
    };
    return weatherUrls[countryCode] || "https://weather.com/weather/today";
  };

  const weatherUrl = getWeatherUrl(country);
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(weatherUrl)}`;

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
        <h1 className="text-xl font-semibold flex-1">Weather ({country})</h1>
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
