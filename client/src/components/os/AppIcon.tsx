import { type ReactNode } from "react";

interface AppIconProps {
  id: string;
  name: string;
  icon: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export function AppIcon({ id, name, icon, onClick, isActive }: AppIconProps) {
  return (
    <button
      data-testid={`icon-app-${id}`}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover-elevate active-elevate-2 group ${
        isActive ? "bg-primary/20" : ""
      }`}
      onClick={onClick}
      onDoubleClick={onClick}
    >
      <div className={`flex items-center justify-center w-14 h-14 rounded-lg bg-secondary/80 backdrop-blur-sm border border-border/50 transition-transform group-hover:scale-105 ${
        isActive ? "ring-2 ring-primary/50" : ""
      }`}>
        <span className="text-primary">{icon}</span>
      </div>
      <span className="text-xs text-foreground/90 max-w-16 truncate text-center drop-shadow-sm">
        {name}
      </span>
    </button>
  );
}
