import { FolderOpen, Settings, FileText, Calculator, Search, Power } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StartMenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAppOpen: (id: string) => void;
}

const apps: StartMenuItem[] = [
  { id: "files", name: "File Manager", icon: <FolderOpen className="w-6 h-6" /> },
  { id: "notes", name: "Notes", icon: <FileText className="w-6 h-6" /> },
  { id: "calculator", name: "Calculator", icon: <Calculator className="w-6 h-6" /> },
  { id: "settings", name: "Settings", icon: <Settings className="w-6 h-6" /> },
];

export function StartMenu({ isOpen, onClose, onAppOpen }: StartMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[150]" 
        onClick={onClose}
        data-testid="start-menu-backdrop"
      />
      <div 
        className="fixed bottom-14 left-2 w-80 bg-card/95 backdrop-blur-xl rounded-lg border border-border shadow-2xl z-[160] animate-slide-up overflow-hidden"
        data-testid="start-menu"
      >
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search apps..."
              className="pl-9 bg-secondary/50"
              data-testid="input-search-apps"
            />
          </div>
        </div>

        <div className="px-2 pb-2">
          <p className="px-2 text-xs text-muted-foreground mb-2">Pinned</p>
          <div className="grid grid-cols-4 gap-1">
            {apps.map((app) => (
              <button
                key={app.id}
                className="flex flex-col items-center gap-1 p-3 rounded-lg hover-elevate active-elevate-2 transition-all"
                onClick={() => {
                  onAppOpen(app.id);
                  onClose();
                }}
                data-testid={`start-menu-app-${app.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                  {app.icon}
                </div>
                <span className="text-xs truncate max-w-full">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
              <span className="text-sm">User</span>
            </div>
            <Button 
              size="icon" 
              variant="ghost"
              data-testid="button-power"
            >
              <Power className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
