import { type ReactNode } from "react";

interface WidgetCardProps {
  title?: string;
  titleColor?: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "small" | "medium" | "large" | "wide";
  interactive?: boolean;
}

export function WidgetCard({ 
  title, 
  titleColor = "text-primary",
  children, 
  onClick,
  className = "",
  size = "medium",
  interactive = false
}: WidgetCardProps) {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
    wide: "col-span-2 row-span-1",
  };

  const baseClasses = `${sizeClasses[size]} bg-card/60 backdrop-blur-md rounded-2xl p-4 text-left transition-all border border-border/30 ${className}`;

  if (interactive && onClick) {
    return (
      <button
        className={`${baseClasses} hover-elevate active-elevate-2`}
        onClick={onClick}
        data-testid={`widget-${title?.toLowerCase().replace(/\s+/g, '-') || 'card'}`}
      >
        {title && (
          <h3 className={`text-sm font-medium mb-3 ${titleColor}`}>{title}</h3>
        )}
        {children}
      </button>
    );
  }

  return (
    <div
      className={baseClasses}
      data-testid={`widget-${title?.toLowerCase().replace(/\s+/g, '-') || 'card'}`}
    >
      {title && (
        <h3 className={`text-sm font-medium mb-3 ${titleColor}`}>{title}</h3>
      )}
      {children}
    </div>
  );
}
