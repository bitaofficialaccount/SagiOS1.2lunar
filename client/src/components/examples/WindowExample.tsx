import { useState } from "react";
import { Window } from "../os/Window";
import { FileText } from "lucide-react";

export default function WindowExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-background">
        <button 
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Reopen Window
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] bg-background overflow-hidden">
      <Window
        id="example"
        title="Example Window"
        icon={<FileText className="w-4 h-4" />}
        initialPosition={{ x: 50, y: 30 }}
        initialSize={{ width: 400, height: 300 }}
        isActive={true}
        isMinimized={isMinimized}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onFocus={() => console.log("Window focused")}
      >
        <div className="p-4">
          <h3 className="font-medium mb-2">Window Content</h3>
          <p className="text-sm text-muted-foreground">
            This is a draggable, resizable window. Try dragging the title bar or resizing from the corner.
          </p>
        </div>
      </Window>
    </div>
  );
}
