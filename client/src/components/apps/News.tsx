import { useState, useRef } from "react";
import { Newspaper, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsSource {
  id: string;
  name: string;
  url: string;
}

const NEWS_SOURCES: NewsSource[] = [
  { id: "bbc", name: "BBC News", url: "https://www.bbc.com/news" },
  { id: "cnn", name: "CNN", url: "https://www.cnn.com" },
  { id: "reuters", name: "Reuters", url: "https://www.reuters.com" },
  { id: "apnews", name: "AP News", url: "https://apnews.com" },
  { id: "techcrunch", name: "TechCrunch", url: "https://techcrunch.com" },
];

interface NewsProps {
  onBack: () => void;
}

export function News({ onBack }: NewsProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(
    localStorage.getItem("newsSource") || null
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeSource = NEWS_SOURCES.find(s => s.id === selectedSource);

  const handleSourceChange = (sourceId: string) => {
    setSelectedSource(sourceId);
    localStorage.setItem("newsSource", sourceId);
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  if (!selectedSource || !activeSource) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold">News</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <Newspaper className="w-24 h-24 text-orange-400 opacity-30" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Choose a News Source</h2>
            <p className="text-muted-foreground mb-8">Select your preferred news provider to get started</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
            {NEWS_SOURCES.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSourceChange(source.id)}
                className="p-4 bg-card/40 rounded-xl border border-border/50 hover-elevate active-elevate-2 transition-all text-left"
                data-testid={`button-news-source-${source.id}`}
              >
                <p className="font-semibold">{source.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{source.url}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 p-3 bg-card/80 backdrop-blur-md border-b border-border/50">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={onBack}
          data-testid="button-news-back"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={refresh}
          data-testid="button-news-refresh"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <h1 className="text-lg font-semibold">{activeSource.name}</h1>

        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => {
            setSelectedSource(null);
            localStorage.removeItem("newsSource");
          }}
          data-testid="button-news-change-source"
        >
          Change Source
        </Button>
      </div>

      <div className="flex-1 bg-background overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`/api/proxy?url=${encodeURIComponent(activeSource.url)}`}
          className="w-full h-full border-0"
          title={activeSource.name}
          data-testid="iframe-news"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
        />
      </div>
    </div>
  );
}
