import { useState, useCallback } from "react";
import { FolderOpen, Settings, FileText, Calculator, Mic } from "lucide-react";
import { VoiceAssistant, type VoiceState } from "./VoiceAssistant";
import { Window } from "./Window";
import { AppIcon } from "./AppIcon";
import { Taskbar, defaultApps } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { Calculator as CalculatorApp } from "../apps/Calculator";
import { Notes } from "../apps/Notes";
import { FileManager } from "../apps/FileManager";
import { Settings as SettingsApp } from "../apps/Settings";

interface OpenWindow {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

const appConfigs: Record<string, { title: string; icon: React.ReactNode; component: React.ReactNode; size: { width: number; height: number } }> = {
  files: {
    title: "File Manager",
    icon: <FolderOpen className="w-4 h-4" />,
    component: <FileManager />,
    size: { width: 700, height: 450 },
  },
  notes: {
    title: "Notes",
    icon: <FileText className="w-4 h-4" />,
    component: <Notes />,
    size: { width: 600, height: 400 },
  },
  calculator: {
    title: "Calculator",
    icon: <Calculator className="w-4 h-4" />,
    component: <CalculatorApp />,
    size: { width: 320, height: 450 },
  },
  settings: {
    title: "Settings",
    icon: <Settings className="w-4 h-4" />,
    component: <SettingsApp />,
    size: { width: 700, height: 500 },
  },
};

const desktopIcons = [
  { id: "files", name: "Files", icon: <FolderOpen className="w-7 h-7" /> },
  { id: "notes", name: "Notes", icon: <FileText className="w-7 h-7" /> },
  { id: "calculator", name: "Calculator", icon: <Calculator className="w-7 h-7" /> },
  { id: "settings", name: "Settings", icon: <Settings className="w-7 h-7" /> },
];

export function Desktop() {
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [windowCounter, setWindowCounter] = useState(0);

  const openApp = useCallback((appId: string) => {
    const config = appConfigs[appId];
    if (!config) return;

    const existingWindow = windows.find(w => w.id.startsWith(appId));
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => 
          w.id === existingWindow.id ? { ...w, isMinimized: false } : w
        ));
      }
      setActiveWindowId(existingWindow.id);
      return;
    }

    const newWindowId = `${appId}-${windowCounter}`;
    const offset = (windows.length % 5) * 30;
    
    const newWindow: OpenWindow = {
      id: newWindowId,
      title: config.title,
      icon: config.icon,
      component: config.component,
      position: { x: 100 + offset, y: 50 + offset },
      size: config.size,
      isMinimized: false,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindowId);
    setWindowCounter(prev => prev + 1);
  }, [windows, windowCounter]);

  const closeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      const remaining = windows.filter(w => w.id !== windowId);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  }, [activeWindowId, windows]);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
    if (activeWindowId === windowId) {
      const visibleWindows = windows.filter(w => w.id !== windowId && !w.isMinimized);
      setActiveWindowId(visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1].id : null);
    }
  }, [activeWindowId, windows]);

  const focusWindow = useCallback((windowId: string) => {
    setActiveWindowId(windowId);
  }, []);

  const handleTaskbarAppClick = useCallback((appId: string) => {
    const existingWindow = windows.find(w => w.id.startsWith(appId));
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => 
          w.id === existingWindow.id ? { ...w, isMinimized: false } : w
        ));
        setActiveWindowId(existingWindow.id);
      } else if (activeWindowId === existingWindow.id) {
        minimizeWindow(existingWindow.id);
      } else {
        setActiveWindowId(existingWindow.id);
      }
    }
  }, [windows, activeWindowId, minimizeWindow]);

  const handleVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes("open calculator")) {
      openApp("calculator");
    } else if (lowerCommand.includes("open notes")) {
      openApp("notes");
    } else if (lowerCommand.includes("open files") || lowerCommand.includes("open file manager")) {
      openApp("files");
    } else if (lowerCommand.includes("open settings")) {
      openApp("settings");
    }
  }, [openApp]);

  const taskbarApps = defaultApps.map(app => ({
    ...app,
    isOpen: windows.some(w => w.id.startsWith(app.id)),
    isMinimized: windows.find(w => w.id.startsWith(app.id))?.isMinimized || false,
  }));

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#232F3E] to-[#1C1C1E] relative" data-testid="desktop">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="absolute top-4 left-4 grid grid-cols-1 gap-2 z-10">
        {desktopIcons.map((icon) => (
          <AppIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            icon={icon.icon}
            onClick={() => openApp(icon.id)}
            isActive={windows.some(w => w.id.startsWith(icon.id))}
          />
        ))}
      </div>

      <div className="absolute inset-0 pb-12 overflow-hidden">
        {windows.map((window) => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            initialSize={window.size}
            isActive={activeWindowId === window.id}
            isMinimized={window.isMinimized}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
          >
            {window.component}
          </Window>
        ))}
      </div>

      {showVoiceOverlay && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[300] flex items-center justify-center" data-testid="voice-overlay">
          <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-primary/30 max-w-md w-full mx-4 animate-fade-in">
            <VoiceAssistant
              onCommand={handleVoiceCommand}
              onStateChange={setVoiceState}
            />
          </div>
        </div>
      )}

      {!showVoiceOverlay && voiceState !== "idle" && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[250]" data-testid="voice-mini">
          <div className="bg-card/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-xl border border-primary/30 flex items-center gap-3 animate-slide-up">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/50 animate-pulse-ring" />
            </div>
            <span className="text-sm">
              {voiceState === "listening" ? "Listening..." : 
               voiceState === "processing" ? "Processing..." : "Speaking..."}
            </span>
          </div>
        </div>
      )}

      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onAppOpen={openApp}
      />

      <Taskbar
        apps={taskbarApps}
        voiceState={voiceState}
        onAppClick={handleTaskbarAppClick}
        onVoiceClick={() => setShowVoiceOverlay(!showVoiceOverlay)}
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
      />
    </div>
  );
}
