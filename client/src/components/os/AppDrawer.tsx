import { Globe, FileText, Settings, Image, Cloud, Video, Music, Newspaper, BookOpen, Compass, Zap, SquareCheckBig, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  isStoreMode?: boolean;
  isDeveloperMode?: boolean;
}

const apps = [
  { id: "browser", name: "Browser", icon: Globe, color: "bg-blue-500/20 text-blue-400" },
  { id: "photos", name: "Photos", icon: Image, color: "bg-pink-500/20 text-pink-400" },
  { id: "weather", name: "Weather", icon: Cloud, color: "bg-cyan-500/20 text-cyan-400" },
  { id: "videos", name: "Videos", icon: Video, color: "bg-red-500/20 text-red-400" },
  { id: "music", name: "Music", icon: Music, color: "bg-indigo-500/20 text-indigo-400" },
  { id: "notes", name: "Notes", icon: FileText, color: "bg-amber-500/20 text-amber-400" },
  { id: "calendar", name: "Calendar", icon: Calendar, color: "bg-rose-500/20 text-rose-400" },
  { id: "news", name: "News", icon: Newspaper, color: "bg-orange-500/20 text-orange-400" },
  { id: "books", name: "Books", icon: BookOpen, color: "bg-yellow-500/20 text-yellow-400" },
  { id: "settings", name: "Settings", icon: Settings, color: "bg-blue-600/20 text-blue-500" },
];

const getStoreApps = (isDeveloperMode: boolean) => {
  const storeApps = [
    { id: "retail", name: "SAGI Retail", icon: Zap, color: "bg-gradient-to-br from-amber-500/40 to-orange-500/40 text-amber-400" },
    { id: "explore", name: "Explore SAGI", icon: Compass, color: "bg-gradient-to-br from-primary/40 to-accent/40 text-accent" },
    { id: "browser", name: "Browser", icon: Globe, color: "bg-blue-500/20 text-blue-400" },
    { id: "photos", name: "Photos", icon: Image, color: "bg-pink-500/20 text-pink-400" },
    { id: "weather", name: "Weather", icon: Cloud, color: "bg-cyan-500/20 text-cyan-400" },
    { id: "videos", name: "Videos", icon: Video, color: "bg-red-500/20 text-red-400" },
    { id: "music", name: "Music", icon: Music, color: "bg-indigo-500/20 text-indigo-400" },
    { id: "notes", name: "Notes", icon: FileText, color: "bg-amber-500/20 text-amber-400" },
    { id: "calendar", name: "Calendar", icon: Calendar, color: "bg-rose-500/20 text-rose-400" },
    { id: "news", name: "News", icon: Newspaper, color: "bg-orange-500/20 text-orange-400" },
    { id: "books", name: "Books", icon: BookOpen, color: "bg-yellow-500/20 text-yellow-400" },
    { id: "settings", name: "Settings", icon: Settings, color: "bg-blue-600/20 text-blue-500" },
  ];
  
  if (isDeveloperMode) {
    storeApps.splice(2, 0, { id: "testing-board", name: "Testing Board", icon: SquareCheckBig, color: "bg-gradient-to-br from-cyan-500/40 to-blue-500/40 text-cyan-400" });
  }
  
  return storeApps;
};

export function AppDrawer({ isOpen, onClose, onNavigate, currentScreen, isStoreMode, isDeveloperMode }: AppDrawerProps) {
  const displayApps = isStoreMode ? getStoreApps(isDeveloperMode || false) : apps;
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[215]" data-testid="app-drawer">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
        data-testid="app-drawer-backdrop"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-3xl font-bold">All Apps</h2>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full"
            onClick={onClose}
            data-testid="button-close-all-apps"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-4 gap-6">
            {displayApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onNavigate(app.id);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl transition-all hover-elevate active-elevate-2 ${
                  currentScreen === app.id ? "ring-2 ring-primary" : ""
                } ${app.color}`}
                data-testid={`app-drawer-${app.id}`}
                title={app.name}
              >
                <app.icon className="w-12 h-12 mb-3" />
                <span className="text-sm font-medium text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
