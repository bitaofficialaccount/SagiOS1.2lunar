import { Home, Globe, FileText, Calculator, Settings, FolderOpen, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  canGoBack: boolean;
  onBack: () => void;
}

export type Screen = "home" | "browser" | "calculator" | "notes" | "files" | "settings";

const menuItems = [
  { id: "home", name: "Home", icon: Home },
  { id: "browser", name: "Browser", icon: Globe },
  { id: "files", name: "Files", icon: FolderOpen },
  { id: "notes", name: "Notes", icon: FileText },
  { id: "calculator", name: "Calculator", icon: Calculator },
  { id: "settings", name: "Settings", icon: Settings },
];

export function SideMenu({ isOpen, onClose, onNavigate, currentScreen, canGoBack, onBack }: SideMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[200]" 
        onClick={onClose}
        data-testid="side-menu-backdrop"
      />
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-xl z-[210] animate-slide-in-left border-r border-border/50" data-testid="side-menu">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button
                size="icon"
                variant="ghost"
                className="w-12 h-12 rounded-full"
                onClick={() => {
                  onBack();
                  onClose();
                }}
                data-testid="button-back"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full"
            onClick={onClose}
            data-testid="button-close-menu"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                currentScreen === item.id 
                  ? "bg-primary/20 text-primary" 
                  : "hover-elevate active-elevate-2"
              }`}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              data-testid={`menu-item-${item.id}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
