import { LucideIcon, Zap, CheckCircle2, Calendar, Cloud, Grid3x3 } from "lucide-react";

export interface WidgetDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  defaultSize: "small" | "medium" | "large";
  category: "info" | "actions" | "quick" | "calendar";
}

export const WIDGET_LIBRARY: WidgetDefinition[] = [
  {
    id: "quick-actions",
    name: "Quick Actions",
    icon: Zap,
    description: "Browse web, take notes, and more",
    defaultSize: "medium",
    category: "quick",
  },
  {
    id: "to-do",
    name: "To Do",
    icon: CheckCircle2,
    description: "Tasks to complete",
    defaultSize: "medium",
    category: "quick",
  },
  {
    id: "completed",
    name: "Completed",
    icon: CheckCircle2,
    description: "Completed tasks",
    defaultSize: "medium",
    category: "quick",
  },
  {
    id: "weather",
    name: "Weather",
    icon: Cloud,
    description: "Current weather & forecast",
    defaultSize: "medium",
    category: "info",
  },
  {
    id: "calendar-month",
    name: "Calendar",
    icon: Calendar,
    description: "Month view calendar",
    defaultSize: "large",
    category: "calendar",
  },
  {
    id: "apps",
    name: "Apps",
    icon: Grid3x3,
    description: "Quick access to all apps",
    defaultSize: "large",
    category: "quick",
  },
];

export const DEFAULT_WIDGETS = ["quick-actions", "to-do", "completed", "weather", "calendar-month", "apps"];

export function getWidgetDefinition(id: string): WidgetDefinition | undefined {
  return WIDGET_LIBRARY.find(w => w.id === id);
}
