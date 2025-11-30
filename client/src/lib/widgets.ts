import { LucideIcon, Zap, Bell, Calendar, Cloud } from "lucide-react";

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
    id: "for-you",
    name: "For You",
    icon: Bell,
    description: "Personalized notifications",
    defaultSize: "medium",
    category: "info",
  },
  {
    id: "today",
    name: "Today",
    icon: Calendar,
    description: "Upcoming events",
    defaultSize: "medium",
    category: "calendar",
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
];

export const DEFAULT_WIDGETS = ["quick-actions", "for-you", "today", "weather", "calendar-month"];

export function getWidgetDefinition(id: string): WidgetDefinition | undefined {
  return WIDGET_LIBRARY.find(w => w.id === id);
}
