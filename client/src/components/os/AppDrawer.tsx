import { Globe, FileText, Calculator, Settings, FolderOpen, X, Image, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

const apps = [
  { id: "browser", name: "Browser", icon: Globe, color: "bg-blue-500/20 text-blue-400" },
  { id: "photos", name: "Photos", icon: Image, color: "bg-pink-500/20 text-pink-400" },
  { id: "weather", name: "Weather", icon: Cloud, color: "bg-cyan-500/20 text-cyan-400" },
  { id: "notes", name: "Notes", icon: FileText, color: "bg-amber-500/20 text-amber-400" },
  { id: "calculator", name: "Calculator", icon: Calculator, color: "bg-green-500/20 text-green-400" },
  { id: "files", name: "Files", icon: FolderOpen, color: "bg-orange-500/20 text-orange-400" },
  { id: "settings", name: "Settings", icon: Settings, color: "bg-purple-500/20 text-purple-400" },
];

export function AppDrawer({ isOpen, onClose, onNavigate, currentScreen }: AppDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[200]" 
        onClick={onClose}
        data-testid="app-drawer-backdrop"
      />
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1628] via-[#1a2942] to-transparent z-[210] animate-slide-in-up rounded-t-3xl border-t border-border/50 backdrop-blur-xl" data-testid="app-drawer">
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

        <div className="p-6 max-h-96 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            {apps.map((app) => (
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
    </>
  );
}
