import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WIDGET_LIBRARY, DEFAULT_WIDGETS } from "@/lib/widgets";

interface WidgetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidgets: string[];
  onUpdateWidgets: (widgets: string[]) => void;
}

export function WidgetManager({ isOpen, onClose, activeWidgets, onUpdateWidgets }: WidgetManagerProps) {
  const handleAdd = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      onUpdateWidgets([...activeWidgets, widgetId]);
    }
  };

  const handleRemove = (widgetId: string) => {
    onUpdateWidgets(activeWidgets.filter(id => id !== widgetId));
  };

  const handleReset = () => {
    onUpdateWidgets(DEFAULT_WIDGETS);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Widgets</DialogTitle>
          <DialogDescription>
            Add or remove widgets from your home screen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Available Widgets</p>
            <div className="space-y-2 max-h-64 overflow-auto">
              {WIDGET_LIBRARY.map(widget => {
                const Icon = widget.icon;
                const isActive = activeWidgets.includes(widget.id);
                
                return (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                    data-testid={`widget-item-${widget.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{widget.name}</p>
                        <p className="text-xs text-muted-foreground">{widget.description}</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => isActive ? handleRemove(widget.id) : handleAdd(widget.id)}
                      data-testid={`button-widget-${widget.id}`}
                    >
                      {isActive ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
              data-testid="button-reset-widgets"
            >
              Reset to Default
            </Button>
            <Button
              onClick={onClose}
              className="flex-1"
              data-testid="button-done-widgets"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
