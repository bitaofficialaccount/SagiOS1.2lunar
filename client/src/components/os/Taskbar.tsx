import { useState, useEffect } from "react";
import { Mic, FolderOpen, Settings, FileText, Calculator, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { VoiceState } from "./VoiceAssistant";

interface TaskbarApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
}

interface TaskbarProps {
  apps: TaskbarApp[];
  voiceState: VoiceState;
  onAppClick: (id: string) => void;
  onVoiceClick: () => void;
  onStartClick: () => void;
}

export function Taskbar({ apps, voiceState, onAppClick, onVoiceClick, onStartClick }: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-secondary/95 backdrop-blur-md border-t border-border/50 flex items-center px-2 gap-1 z-[200]" data-testid="taskbar">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10"
            onClick={onStartClick}
            data-testid="button-start-menu"
          >
            <LayoutGrid className="w-5 h-5 text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Start Menu</TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border/50 mx-1" />

      <div className="flex items-center gap-1 flex-1">
        {apps.filter(app => app.isOpen).map((app) => (
          <Tooltip key={app.id}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={app.isMinimized ? "ghost" : "secondary"}
                className={`w-10 h-10 ${!app.isMinimized ? "ring-1 ring-primary/50" : ""}`}
                onClick={() => onAppClick(app.id)}
                data-testid={`taskbar-app-${app.id}`}
              >
                {app.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{app.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={voiceState !== "idle" ? "default" : "ghost"}
              className={`w-10 h-10 relative ${voiceState !== "idle" ? "bg-primary" : ""}`}
              onClick={onVoiceClick}
              data-testid="button-taskbar-voice"
            >
              <Mic className={`w-5 h-5 ${voiceState === "listening" ? "animate-pulse" : ""}`} />
              {voiceState !== "idle" && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {voiceState === "idle" ? 'Say "Hey, Sagi"' : "Voice Active"}
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border/50" />

        <button 
          className="flex flex-col items-end px-3 py-1 text-xs hover-elevate rounded"
          data-testid="button-system-tray"
        >
          <span className="text-foreground" data-testid="text-time">{formatTime(time)}</span>
          <span className="text-muted-foreground" data-testid="text-date">{formatDate(time)}</span>
        </button>
      </div>
    </div>
  );
}

export const defaultApps: TaskbarApp[] = [
  { id: "files", name: "Files", icon: <FolderOpen className="w-5 h-5" />, isOpen: false, isMinimized: false },
  { id: "notes", name: "Notes", icon: <FileText className="w-5 h-5" />, isOpen: false, isMinimized: false },
  { id: "calculator", name: "Calculator", icon: <Calculator className="w-5 h-5" />, isOpen: false, isMinimized: false },
  { id: "settings", name: "Settings", icon: <Settings className="w-5 h-5" />, isOpen: false, isMinimized: false },
];
