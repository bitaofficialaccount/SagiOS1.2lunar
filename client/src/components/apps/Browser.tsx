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
          <iframe scrolling="yes"
            ref={iframeRef}
            src={`/api/proxy?url=${encodeURIComponent(activeTab.url)}`}
            className="w-full h-full border-0"
            title={activeTab.title}
            data-testid="iframe-browser"
            sandbox="allow-scripts allow-popups allow-forms allow-pointer-lock allow-modals allow-presentation allow-top-navigation"
            allow="fullscreen"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-semibold mb-6">New Tab</h2>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {defaultBookmarks.map((bookmark) => (
                <button
                  key={bookmark.name}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover-elevate active-elevate-2"
                  onClick={() => navigateTo(bookmark.url)}
                  data-testid={`bookmark-${bookmark.name.toLowerCase()}`}
                >
                  <div className="text-4xl">{bookmark.icon}</div>
                  <p className="text-sm font-medium">{bookmark.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Address Bar at Bottom */}
      <form onSubmit={handleSubmit} className="p-4 bg-card/80 backdrop-blur-md border-t border-border/50">
        <div className="relative flex items-center max-w-2xl mx-auto">
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
    </div>
  );
}
