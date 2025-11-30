import { Globe, FileText, Calculator, Settings, FolderOpen, X, Image, Cloud, Video, Music, Map, Newspaper, BookOpen, Compass, Zap, SquareCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  isStoreMode?: boolean;
}

const apps = [
  { id: "browser", name: "Browser", icon: Globe, color: "bg-blue-500/20 text-blue-400" },
  { id: "photos", name: "Photos", icon: Image, color: "bg-pink-500/20 text-pink-400" },
  { id: "weather", name: "Weather", icon: Cloud, color: "bg-cyan-500/20 text-cyan-400" },
  { id: "videos", name: "Videos", icon: Video, color: "bg-red-500/20 text-red-400" },
  { id: "music", name: "Music", icon: Music, color: "bg-purple-500/20 text-purple-400" },
  { id: "notes", name: "Notes", icon: FileText, color: "bg-amber-500/20 text-amber-400" },
  { id: "maps", name: "Maps", icon: Map, color: "bg-green-500/20 text-green-400" },
  { id: "news", name: "News", icon: Newspaper, color: "bg-orange-500/20 text-orange-400" },
  { id: "books", name: "Books", icon: BookOpen, color: "bg-yellow-500/20 text-yellow-400" },
  { id: "calculator", name: "Calculator", icon: Calculator, color: "bg-teal-500/20 text-teal-400" },
  { id: "files", name: "Files", icon: FolderOpen, color: "bg-sky-500/20 text-sky-400" },
  { id: "settings", name: "Settings", icon: Settings, color: "bg-slate-500/20 text-slate-400" },
];

const storeApps = [
  { id: "retail", name: "SAGI Retail", icon: Zap, color: "bg-gradient-to-br from-yellow-500/40 to-orange-500/40 text-yellow-400" },
  { id: "explore", name: "Explore SAGI", icon: Compass, color: "bg-gradient-to-br from-primary/40 to-accent/40 text-primary" },
  { id: "browser", name: "Browser", icon: Globe, color: "bg-blue-500/20 text-blue-400" },
  { id: "photos", name: "Photos", icon: Image, color: "bg-pink-500/20 text-pink-400" },
  { id: "weather", name: "Weather", icon: Cloud, color: "bg-cyan-500/20 text-cyan-400" },
  { id: "videos", name: "Videos", icon: Video, color: "bg-red-500/20 text-red-400" },
  { id: "music", name: "Music", icon: Music, color: "bg-purple-500/20 text-purple-400" },
  { id: "notes", name: "Notes", icon: FileText, color: "bg-amber-500/20 text-amber-400" },
  { id: "maps", name: "Maps", icon: Map, color: "bg-green-500/20 text-green-400" },
  { id: "testing-board", name: "Testing Board", icon: SquareCheckBig, color: "bg-gradient-to-br from-emerald-500/40 to-green-500/40 text-emerald-400" },
  { id: "news", name: "News", icon: Newspaper, color: "bg-orange-500/20 text-orange-400" },
  { id: "books", name: "Books", icon: BookOpen, color: "bg-yellow-500/20 text-yellow-400" },
  { id: "calculator", name: "Calculator", icon: Calculator, color: "bg-teal-500/20 text-teal-400" },
  { id: "files", name: "Files", icon: FolderOpen, color: "bg-sky-500/20 text-sky-400" },
  { id: "settings", name: "Settings", icon: Settings, color: "bg-slate-500/20 text-slate-400" },
];

export function AppDrawer({ isOpen, onClose, onNavigate, currentScreen, isStoreMode }: AppDrawerProps) {
  const displayApps = isStoreMode ? storeApps : apps;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[210]" data-testid="app-drawer">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
        data-testid="app-drawer-backdrop"
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1628] via-[#1a2942] to-[#1a2942]/80 animate-slide-in-up rounded-t-3xl border-t border-border/50 backdrop-blur-xl">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
          <h2 className="text-2xl font-semibold">All Apps</h2>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full"
            onClick={onClose}
            data-testid="button-close-drawer"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            {displayApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onNavigate(app.id);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all hover-elevate active-elevate-2 ${
                  currentScreen === app.id ? "ring-2 ring-primary" : ""
                } ${app.color}`}
                data-testid={`app-drawer-${app.id}`}
              >
                <app.icon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
