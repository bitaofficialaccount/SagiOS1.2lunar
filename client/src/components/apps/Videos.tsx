import { Play, Settings } from "lucide-react";
import { useState } from "react";
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

  const videos = [
    { title: "Nature Documentary", duration: "45:32" },
    { title: "Travel Vlog", duration: "28:15" },
    { title: "Tutorial", duration: "12:45" },
    { title: "Music Video", duration: "3:45" },
  ];

  const handleSelectProvider = (providerId: string) => {
    localStorage.setItem("videoProvider", providerId);
    setSelectedProvider(providerId);
  };

  const currentProvider = videoProviders.find(p => p.id === selectedProvider);

  if (!selectedProvider) {
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
                onClick={() => {
                  handleSelectProvider(provider.id);
                  window.location.href = `/api/proxy?url=${encodeURIComponent(provider.url)}`;
                }}
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
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center justify-between px-6 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="text-sm text-muted-foreground">{currentProvider?.name}</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            localStorage.removeItem("videoProvider");
            setSelectedProvider(null);
          }}
          data-testid="button-change-provider"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto">
        <div className="space-y-4">
          {videos.map((video, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-card/40 rounded-xl border border-border/50 hover-elevate cursor-pointer">
              <div className="w-20 h-20 bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{video.title}</p>
                <p className="text-sm text-muted-foreground">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
