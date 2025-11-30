import { Image, Settings, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PhotosProps {
  onBack: () => void;
}

const photoProviders = [
  { id: "google", name: "Google Photos", url: "https://photos.google.com" },
  { id: "microsoft", name: "OneDrive", url: "https://onedrive.live.com" },
  { id: "icloud", name: "iCloud Photos", url: "https://www.icloud.com" },
  { id: "amazon", name: "Amazon Photos", url: "https://www.amazon.com/photos" },
  { id: "flickr", name: "Flickr", url: "https://www.flickr.com" },
];

export function Photos({ onBack }: PhotosProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(() => {
    return localStorage.getItem("photosProvider") || null;
  });

  const handleSelectProvider = (providerId: string) => {
    localStorage.setItem("photosProvider", providerId);
    setSelectedProvider(providerId);
  };

  const currentProvider = photoProviders.find(p => p.id === selectedProvider);

  if (!selectedProvider) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
        <div className="flex items-center gap-4 px-6 mb-6">
          <Image className="w-8 h-8 text-pink-400" />
          <h1 className="text-3xl font-bold">Photos</h1>
        </div>

        <div className="flex-1 px-6 pb-20 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-6">Choose Your Photo Provider</h2>
          <div className="w-full max-w-sm space-y-3">
            {photoProviders.map((provider) => (
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
                <ChevronRight className="w-5 h-5 ml-2" />
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
          <Image className="w-8 h-8 text-pink-400" />
          <div>
            <h1 className="text-3xl font-bold">Photos</h1>
            <p className="text-sm text-muted-foreground">{currentProvider?.name}</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            localStorage.removeItem("photosProvider");
            setSelectedProvider(null);
          }}
          data-testid="button-change-provider"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <Image className="w-24 h-24 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">No photos yet</h2>
          <p className="text-muted-foreground">Your photos from {currentProvider?.name} will appear here</p>
        </div>
      </div>
    </div>
  );
}
