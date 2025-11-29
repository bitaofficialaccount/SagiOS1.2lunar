import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Home, Search, X, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tab {
  id: string;
  url: string;
  title: string;
}

interface BrowserProps {
  onBack?: () => void;
}

const defaultBookmarks = [
  { name: "Google", url: "https://www.google.com", icon: "🔍" },
  { name: "YouTube", url: "https://www.youtube.com", icon: "▶️" },
  { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "📚" },
  { name: "GitHub", url: "https://www.github.com", icon: "💻" },
];

export function Browser({ onBack }: BrowserProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", url: "", title: "New Tab" }
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [inputUrl, setInputUrl] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const navigateTo = (url: string) => {
    let finalUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      if (url.includes(".") && !url.includes(" ")) {
        finalUrl = "https://" + url;
      } else {
        finalUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`;
      }
    }

    setTabs(tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, url: finalUrl, title: url }
        : t
    ));
    setInputUrl(finalUrl);
    
    const newHistory = [...history.slice(0, historyIndex + 1), finalUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setTabs(tabs.map(t => 
        t.id === activeTabId 
          ? { ...t, url, title: url }
          : t
      ));
      setInputUrl(url);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setTabs(tabs.map(t => 
        t.id === activeTabId 
          ? { ...t, url, title: url }
          : t
      ));
      setInputUrl(url);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const goHome = () => {
    setTabs(tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, url: "", title: "New Tab" }
        : t
    ));
    setInputUrl("");
  };

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      url: "",
      title: "New Tab"
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl("");
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 p-3 bg-card/80 backdrop-blur-md border-b border-border/50">
        {onBack && (
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full shrink-0"
            onClick={onBack}
            data-testid="button-browser-back-nav"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={goBack}
          disabled={historyIndex <= 0}
          data-testid="button-browser-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          data-testid="button-browser-forward"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={refresh}
          data-testid="button-browser-refresh"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={goHome}
          data-testid="button-browser-home"
        >
          <Home className="w-5 h-5" />
        </Button>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Search or enter URL"
              className="pl-12 pr-12 h-12 rounded-full bg-secondary/50 text-base"
              data-testid="input-browser-url"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
            >
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={addTab}
          data-testid="button-browser-new-tab"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {tabs.length > 1 && (
        <div className="flex items-center gap-1 px-3 py-2 bg-secondary/30 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                activeTabId === tab.id 
                  ? "bg-card text-foreground" 
                  : "text-muted-foreground hover-elevate"
              }`}
              onClick={() => setActiveTabId(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              <span className="max-w-32 truncate">{tab.title || "New Tab"}</span>
              <button
                className="p-1 rounded hover:bg-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 bg-background overflow-hidden">
        {activeTab.url ? (
          <iframe
            ref={iframeRef}
            src={activeTab.url}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Browser"
            data-testid="browser-iframe"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h1 className="text-4xl font-light mb-8 text-primary">SagiOS Browser</h1>
            
            <form onSubmit={handleSubmit} className="w-full max-w-xl mb-12">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Search the web or enter URL"
                  className="pl-14 h-16 rounded-full text-lg bg-card/60 backdrop-blur-md border-border/50"
                  data-testid="input-browser-search-home"
                />
              </div>
            </form>

            <div className="grid grid-cols-4 gap-6">
              {defaultBookmarks.map((bookmark, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl hover-elevate active-elevate-2 transition-all"
                  onClick={() => navigateTo(bookmark.url)}
                  data-testid={`bookmark-${index}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-card/60 backdrop-blur-md flex items-center justify-center text-3xl border border-border/30">
                    {bookmark.icon}
                  </div>
                  <span className="text-sm">{bookmark.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
