import { useState } from "react";
import { Newspaper, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsProps {
  onBack: () => void;
}

export function News({ onBack }: NewsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [newsSource, setNewsSource] = useState(localStorage.getItem("newsSource") || "bbc");

  if (showSettings) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button size="icon" variant="ghost" onClick={() => setShowSettings(false)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">News Settings</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            <div>
              <Label htmlFor="news-source">News Source</Label>
              <p className="text-xs text-muted-foreground mb-3">Choose your preferred news provider</p>
              <select
                id="news-source"
                value={newsSource}
                onChange={(e) => {
                  setNewsSource(e.target.value);
                  localStorage.setItem("newsSource", e.target.value);
                }}
                className="w-full p-2 rounded-lg bg-card/40 border border-border/50 text-foreground text-sm"
                data-testid="select-news-source"
              >
                <option value="bbc">BBC News</option>
                <option value="cnn">CNN</option>
                <option value="reuters">Reuters</option>
                <option value="ap">Associated Press</option>
                <option value="techcrunch">TechCrunch</option>
              </select>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-sm text-muted-foreground">
                Select your preferred news source to get personalized news feeds.
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
        <Newspaper className="w-8 h-8 text-orange-400" />
        <h1 className="text-3xl font-bold">News</h1>
        <Button 
          size="icon" 
          variant="ghost" 
          className="ml-auto"
          onClick={() => setShowSettings(true)}
          data-testid="button-news-settings"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto flex flex-col items-center justify-center">
        <Newspaper className="w-24 h-24 text-orange-400 opacity-30 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">News Feed</h2>
        <p className="text-muted-foreground text-center mb-6">
          Configure your news preferences in settings to get personalized headlines
        </p>
        <Button onClick={() => setShowSettings(true)} data-testid="button-configure-news">
          Configure News
        </Button>
      </div>
    </div>
  );
}
