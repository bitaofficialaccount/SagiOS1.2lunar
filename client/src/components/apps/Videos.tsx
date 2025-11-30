import { Play, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface VideosProps {
  onBack: () => void;
}

const videoProviders = [
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com" },
  { id: "netflix", name: "Netflix", url: "https://www.netflix.com" },
  { id: "prime", name: "Amazon Prime Video", url: "https://www.primevideo.com" },
  { id: "disney", name: "Disney+", url: "https://www.disneyplus.com" },
  { id: "hulu", name: "Hulu", url: "https://www.hulu.com" },
];

export function Videos({ onBack }: VideosProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(() => {
    return localStorage.getItem("videoProvider") || null;
  });
  const [selectedUrl, setSelectedUrl] = useState<string | null>(() => {
    const saved = localStorage.getItem("videoProvider");
    if (saved) {
      const provider = videoProviders.find(p => p.id === saved);
      return provider?.url || null;
    }
    return null;
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSelectProvider = (providerId: string) => {
    const provider = videoProviders.find(p => p.id === providerId);
    if (provider) {
      localStorage.setItem("videoProvider", providerId);
      setSelectedProvider(providerId);
      setSelectedUrl(provider.url);
    }
  };

  const handleBack = () => {
    localStorage.removeItem("videoProvider");
    setSelectedProvider(null);
    setSelectedUrl(null);
  };

  const currentProvider = videoProviders.find(p => p.id === selectedProvider);

  if (!selectedUrl) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
        <div className="flex items-center gap-4 px-6 mb-6">
          <h1 className="text-3xl font-bold">Videos</h1>
        </div>

        <div className="flex-1 px-6 pb-20 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-6">Choose Your Video Provider</h2>
          <div className="w-full max-w-sm space-y-3">
            {videoProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="secondary"
                className="w-full h-14 text-lg"
                onClick={() => handleSelectProvider(provider.id)}
                data-testid={`button-provider-${provider.id}`}
              >
                {provider.name}
                <Play className="w-5 h-5 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={onBack}
          data-testid="button-videos-back-app"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={handleBack}
          data-testid="button-videos-change-provider"
        >
          <Play className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold">{currentProvider?.name || "Videos"}</h1>
      </div>

      <div className="flex-1 bg-background overflow-hidden">
        <iframe scrolling="yes"
          ref={iframeRef}
          src={`/api/proxy?url=${encodeURIComponent(selectedUrl)}`}
          className="w-full h-full border-0"
          title="Video Provider"
          data-testid="iframe-videos"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-modals allow-presentation"
            allow="fullscreen"
        />
      </div>
    </div>
  );
}
