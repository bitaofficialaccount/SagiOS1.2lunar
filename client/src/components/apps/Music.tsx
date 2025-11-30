import { useState } from "react";
import { Music as MusicIcon, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MusicAppProps {
  onBack: () => void;
}

export function Music({ onBack }: MusicAppProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [musicProvider, setMusicProvider] = useState(localStorage.getItem("musicProvider") || "spotify");

  if (showSettings) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button size="icon" variant="ghost" onClick={() => setShowSettings(false)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">Music Settings</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            <div>
              <Label htmlFor="music-provider">Music Provider</Label>
              <p className="text-xs text-muted-foreground mb-3">Choose your music streaming service</p>
              <select
                id="music-provider"
                value={musicProvider}
                onChange={(e) => {
                  setMusicProvider(e.target.value);
                  localStorage.setItem("musicProvider", e.target.value);
                }}
                className="w-full p-2 rounded-lg bg-card/40 border border-border/50 text-foreground text-sm"
                data-testid="select-music-provider"
              >
                <option value="spotify">Spotify</option>
                <option value="apple">Apple Music</option>
                <option value="youtube">YouTube Music</option>
                <option value="amazon">Amazon Music</option>
                <option value="local">Local Library</option>
              </select>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-sm text-muted-foreground">
                Configure your music streaming settings to connect your favorite music service.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <MusicIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold">Music</h1>
        <Button 
          size="icon" 
          variant="ghost" 
          className="ml-auto"
          onClick={() => setShowSettings(true)}
          data-testid="button-music-settings"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto flex flex-col items-center justify-center">
        <MusicIcon className="w-24 h-24 text-purple-400 opacity-30 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Music Player</h2>
        <p className="text-muted-foreground text-center mb-6">
          Connect your {musicProvider.charAt(0).toUpperCase() + musicProvider.slice(1)} account in settings to start playing music
        </p>
        <Button onClick={() => setShowSettings(true)} data-testid="button-connect-music">
          Connect Music Service
        </Button>
      </div>
    </div>
  );
}
