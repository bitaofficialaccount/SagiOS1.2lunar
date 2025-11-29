import { useState, useRef, useEffect, type ReactNode } from "react";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WindowProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  isActive?: boolean;
  isMinimized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
}

export function Window({
  id,
  title,
  icon,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minSize = { width: 320, height: 240 },
  isActive = false,
  isMinimized = false,
  onClose,
  onMinimize,
  onFocus,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const savedState = useRef({ position, size });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: Math.max(0, e.clientY - dragOffset.current.y),
        });
      }
      if (isResizing && !isMaximized) {
        const newWidth = Math.max(minSize.width, e.clientX - position.x);
        const newHeight = Math.max(minSize.height, e.clientY - position.y);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, isMaximized, position.x, position.y, minSize]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setIsDragging(true);
    onFocus?.();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    onFocus?.();
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setPosition(savedState.current.position);
      setSize(savedState.current.size);
    } else {
      savedState.current = { position, size };
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 48 });
    }
    setIsMaximized(!isMaximized);
  };

  const handleDoubleClick = () => {
    toggleMaximize();
  };

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      data-testid={`window-${id}`}
      className={`absolute flex flex-col bg-card/95 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl border border-border transition-shadow animate-fade-in ${
        isActive ? "shadow-primary/20 ring-1 ring-primary/30" : ""
      } ${isDragging ? "cursor-grabbing" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        width: isMaximized ? "100%" : size.width,
        height: isMaximized ? "calc(100% - 48px)" : size.height,
        zIndex: isActive ? 100 : 50,
      }}
      onClick={onFocus}
    >
      <div
        className="flex items-center gap-2 h-8 px-3 bg-secondary/50 cursor-grab select-none shrink-0"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {icon && <span className="text-primary">{icon}</span>}
        <span className="text-sm font-medium flex-1 truncate" data-testid={`text-window-title-${id}`}>{title}</span>
        
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="w-6 h-6 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            data-testid={`button-minimize-${id}`}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-6 h-6 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
            data-testid={`button-maximize-${id}`}
          >
            {isMaximized ? <Square className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-6 h-6 rounded-sm hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            data-testid={`button-close-${id}`}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg
            className="w-full h-full text-muted-foreground/50"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
          </svg>
        </div>
      )}
    </div>
  );
}
