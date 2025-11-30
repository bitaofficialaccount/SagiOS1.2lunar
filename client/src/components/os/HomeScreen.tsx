import { useState, useEffect } from "react";
import { Play, Calendar, Cloud, Sun, CloudRain, Image, Bell, ShoppingBag, Zap, Lightbulb, Compass, Mic, Hand, Keyboard, AppWindow, MousePointer2, Settings, Globe, FileText, Video, Music, Newspaper, BookOpen, Grid3x3, CheckCircle2, Circle, RotateCcw } from "lucide-react";
import { WidgetCard } from "./WidgetCard";
import { WidgetManager } from "./WidgetManager";
import { Button } from "@/components/ui/button";
import { DEFAULT_WIDGETS } from "@/lib/widgets";

interface HomeScreenProps {
  onOpenApp: (app: string) => void;
  onOpenVoice: () => void;
  isStoreMode?: boolean;
}

export function HomeScreen({ onOpenApp, onOpenVoice, isStoreMode }: HomeScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem("activeWidgets");
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  const [widgetManagerOpen, setWidgetManagerOpen] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("activeWidgets", JSON.stringify(activeWidgets));
  }, [activeWidgets]);

  const handleDragStart = (widgetId: string, e: React.DragEvent) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", widgetId);
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedWidget) return;

    const draggedIndex = activeWidgets.indexOf(draggedWidget);
    if (draggedIndex === -1) return;

    const newWidgets = [...activeWidgets];
    newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedWidget);
    
    setActiveWidgets(newWidgets);
    setDraggedWidget(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    setDragOverIndex(null);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const today = currentDate.getDate();

  const [upcomingEvents, setUpcomingEvents] = useState<Array<{ time: string; title: string }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sagiCalendarEvents");
    if (saved) {
      try {
        const events = JSON.parse(saved);
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const todayEvents = events
          .filter((e: any) => e.date === todayStr)
          .sort((a: any, b: any) => a.time.localeCompare(b.time))
          .map((e: any) => ({ time: e.time, title: e.title }));
        
        if (todayEvents.length > 0) {
          setUpcomingEvents(todayEvents);
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Failed to load calendar events", err);
        }
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sagiTasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Failed to load tasks", err);
        }
      }
    }
  }, []);

  const forYouItems: Array<{ icon: any; title: string; subtitle: string; color: string }> = [];

  // Store Mode content with educational widgets
  if (isStoreMode) {
    return (
      <div className="h-full overflow-auto p-6 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to SAGI</h1>
            <p className="text-lg text-muted-foreground">Your AI-powered smart assistant. Explore all features below.</p>
          </div>

          {/* What's New */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <WidgetCard 
              title="What's New" 
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
            >
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-white/5 rounded-lg">
                  <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Voice Assistant</p>
                    <p className="text-xs text-muted-foreground">Context-aware conversations with history</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-white/5 rounded-lg">
                  <Compass className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Explore Mode</p>
                    <p className="text-xs text-muted-foreground">Discover all system features</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-white/5 rounded-lg">
                  <Mic className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Multi-App Support</p>
                    <p className="text-xs text-muted-foreground">12+ integrated applications</p>
                  </div>
                </div>
              </div>
            </WidgetCard>

            <WidgetCard 
              title="Voice Commands" 
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
            >
              <div className="space-y-3">
                <div className="mb-3">
                  <p className="text-sm font-medium mb-2">Quick Commands:</p>
                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground">• "Hey, Sagi" to activate</p>
                    <p className="text-muted-foreground">• "Open browser" or "Open mail"</p>
                    <p className="text-muted-foreground">• "What's the weather?"</p>
                    <p className="text-muted-foreground">• "Tell me a joke"</p>
                    <p className="text-muted-foreground">• "Show me the news"</p>
                  </div>
                </div>
              </div>
            </WidgetCard>
          </div>

          {/* How-To Guides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <WidgetCard 
              title="Gesture Controls" 
              className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20"
            >
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Hand className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Swipe Up</p>
                    <p className="text-xs text-muted-foreground">Open app drawer</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Hand className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Swipe Down</p>
                    <p className="text-xs text-muted-foreground">Go back from app</p>
                  </div>
                </div>
              </div>
            </WidgetCard>

            <WidgetCard 
              title="Text Input" 
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
            >
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Keyboard className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Virtual Keyboard</p>
                    <p className="text-xs text-muted-foreground">Full QWERTY layout</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Mic className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Voice to Text</p>
                    <p className="text-xs text-muted-foreground">Talk to type</p>
                  </div>
                </div>
              </div>
            </WidgetCard>

            <WidgetCard 
              title="Quick Tips" 
              className="bg-gradient-to-br from-pink-500/20 to-rose-500/20"
            >
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Lightbulb className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Multi-Account</p>
                    <p className="text-xs text-muted-foreground">Connect your services</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MousePointer2 className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Easy Navigation</p>
                    <p className="text-xs text-muted-foreground">Touch or voice</p>
                  </div>
                </div>
              </div>
            </WidgetCard>
          </div>

          {/* App Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <WidgetCard className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
              <div className="flex flex-col items-center text-center">
                <Play className="w-8 h-8 text-blue-400 mb-2" />
                <p className="font-medium text-sm">Web Browser</p>
                <p className="text-xs text-muted-foreground mt-1">Browse the web freely</p>
              </div>
            </WidgetCard>
            <WidgetCard className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <div className="flex flex-col items-center text-center">
                <Image className="w-8 h-8 text-blue-400 mb-2" />
                <p className="font-medium text-sm">Photos</p>
                <p className="text-xs text-muted-foreground mt-1">View your galleries</p>
              </div>
            </WidgetCard>
            <WidgetCard className="bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <div className="flex flex-col items-center text-center">
                <Play className="w-8 h-8 text-red-400 mb-2" />
                <p className="font-medium text-sm">Videos</p>
                <p className="text-xs text-muted-foreground mt-1">Stream your shows</p>
              </div>
            </WidgetCard>
            <WidgetCard className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <div className="flex flex-col items-center text-center">
                <Cloud className="w-8 h-8 text-cyan-400 mb-2" />
                <p className="font-medium text-sm">Weather</p>
                <p className="text-xs text-muted-foreground mt-1">Real-time forecast</p>
              </div>
            </WidgetCard>
          </div>

          {/* Explore Sagi CTA */}
          <WidgetCard className="bg-gradient-to-r from-primary/30 to-accent/30 border border-primary/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Explore SAGI</h3>
                <p className="text-muted-foreground mb-4">Discover all features and capabilities in depth</p>
              </div>
              <Button
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenApp("explore");
                }}
                data-testid="button-explore-sagi-store"
              >
                <Compass className="w-5 h-5 mr-2" />
                Explore
              </Button>
            </div>
          </WidgetCard>
        </div>
      </div>
    );
  }

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "quick-actions":
        return (
          <WidgetCard key="quick-actions" title="Quick Actions" size="medium">
            <div className="flex flex-col gap-3">
              <button 
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover-elevate active-elevate-2"
                onClick={(e) => { e.stopPropagation(); onOpenApp("browser"); }}
                data-testid="quick-action-browser"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Browse Web</p>
                  <p className="text-xs text-muted-foreground">Open browser</p>
                </div>
              </button>
              <button 
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover-elevate active-elevate-2"
                onClick={(e) => { e.stopPropagation(); onOpenApp("notes"); }}
                data-testid="quick-action-notes"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Image className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Notes</p>
                  <p className="text-xs text-muted-foreground">Your notes</p>
                </div>
              </button>
            </div>
          </WidgetCard>
        );
      case "for-you":
        return (
          <WidgetCard key="for-you" title="For You" size="medium">
            <div className="space-y-3">
              {forYouItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        );
      case "today":
        return (
          <WidgetCard key="today" title="Today" size="medium">
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-xs text-muted-foreground w-14 shrink-0 pt-0.5">{event.time}</span>
                  <p className="text-sm">{event.title}</p>
                </div>
              ))}
            </div>
          </WidgetCard>
        );
      case "weather":
        return (
          <WidgetCard key="weather" size="medium" className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
            <div className="flex flex-col h-full">
              <p className="text-sm text-muted-foreground mb-2">Seattle, WA</p>
              <div className="flex items-center gap-4 mb-4">
                <Sun className="w-16 h-16 text-yellow-400" />
                <div>
                  <p className="text-4xl font-light">65°</p>
                  <p className="text-sm text-muted-foreground">Sunny</p>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-xs text-muted-foreground">H 65° L 48°</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <div className="text-center">
                    <p className="text-muted-foreground">1 PM</p>
                    <Sun className="w-4 h-4 mx-auto my-1 text-yellow-400" />
                    <p>72°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">2 PM</p>
                    <Cloud className="w-4 h-4 mx-auto my-1 text-gray-400" />
                    <p>74°</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">3 PM</p>
                    <CloudRain className="w-4 h-4 mx-auto my-1 text-blue-400" />
                    <p>71°</p>
                  </div>
                </div>
              </div>
            </div>
          </WidgetCard>
        );
      case "calendar-month":
        return (
          <WidgetCard key="calendar-month" size="large">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-muted-foreground py-1">{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <button
                    key={i + 1}
                    className={`py-1 rounded-full transition-colors ${
                      i + 1 === today 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </WidgetCard>
        );
      case "apps":
        const appGrid = [
          { id: "browser", name: "Browser", icon: Globe, color: "text-blue-400" },
          { id: "tasks", name: "Tasks", icon: FileText, color: "text-green-400" },
          { id: "notes", name: "Notes", icon: FileText, color: "text-amber-400" },
          { id: "videos", name: "Videos", icon: Video, color: "text-red-400" },
          { id: "music", name: "Music", icon: Music, color: "text-blue-400" },
          { id: "news", name: "News", icon: Newspaper, color: "text-orange-400" },
        ];
        return (
          <WidgetCard key="apps" size="large" title="Apps">
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                {appGrid.map(app => {
                  const AppIcon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenApp(app.id);
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/30 hover-elevate active-elevate-2 transition-all"
                      data-testid={`app-widget-${app.id}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                        <AppIcon className={`w-5 h-5 ${app.color}`} />
                      </div>
                      <span className="text-xs font-medium text-center">{app.name}</span>
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenApp("home");
                }}
                variant="outline"
                className="w-full"
                data-testid="button-all-apps-widget"
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                See All Apps
              </Button>
            </div>
          </WidgetCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-auto p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Home</h1>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setActiveWidgets(DEFAULT_WIDGETS);
              }}
              data-testid="button-reset-widgets"
              title="Reset to default layout"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setWidgetManagerOpen(true)}
              data-testid="button-manage-widgets"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 grid-rows-auto gap-4">
          {activeWidgets.map((widgetId, index) => (
            <div
              key={widgetId}
              draggable
              onDragStart={(e) => handleDragStart(widgetId, e)}
              onDragOver={(e) => handleDragOver(index, e)}
              onDrop={(e) => handleDrop(index, e)}
              onDragEnd={handleDragEnd}
              onDragLeave={() => setDragOverIndex(null)}
              className={`transition-all ${
                draggedWidget === widgetId ? "opacity-50 cursor-grabbing" : "cursor-grab hover:opacity-90"
              } ${dragOverIndex === index ? "ring-2 ring-primary scale-105" : ""}`}
              data-testid={`widget-draggable-${widgetId}`}
            >
              {renderWidget(widgetId)}
            </div>
          ))}
        </div>
      </div>

      <WidgetManager
        isOpen={widgetManagerOpen}
        onClose={() => setWidgetManagerOpen(false)}
        activeWidgets={activeWidgets}
        onUpdateWidgets={setActiveWidgets}
      />
    </div>
  );
}
