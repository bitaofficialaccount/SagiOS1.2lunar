import { useState, useEffect } from "react";
import { Play, Calendar, Cloud, Sun, CloudRain, Image, Bell, ShoppingBag, Mic } from "lucide-react";
import { WidgetCard } from "./WidgetCard";
import { Button } from "@/components/ui/button";

interface HomeScreenProps {
  onOpenApp: (app: string) => void;
  onOpenVoice: () => void;
}

export function HomeScreen({ onOpenApp, onOpenVoice }: HomeScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const upcomingEvents = [
    { time: "11 AM", title: "Team Meeting" },
    { time: "2 PM", title: "Project Review" },
    { time: "4:30 PM", title: "Client Call" },
  ];

  const forYouItems = [
    { icon: Bell, title: "New notification", subtitle: "System Update", color: "text-blue-400" },
    { icon: Cloud, title: "Weather Alert", subtitle: "Rain expected tomorrow", color: "text-cyan-400" },
    { icon: ShoppingBag, title: "Reminder", subtitle: "Shopping list ready", color: "text-orange-400" },
  ];

  return (
    <div className="h-full overflow-auto p-6 pt-20">
      <div className="grid grid-cols-4 grid-rows-3 gap-4 max-w-7xl mx-auto h-full">
        <WidgetCard 
          title="Quick Actions" 
          size="medium"
        >
          <div className="flex flex-col gap-3">
            <button 
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover-elevate active-elevate-2"
              onClick={(e) => {
                e.stopPropagation();
                onOpenApp("browser");
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onOpenApp("notes");
              }}
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

        <WidgetCard 
          title="For You" 
          size="medium"
        >
          <div className="space-y-3">
            {forYouItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer"
              >
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

        <WidgetCard 
          title="Today" 
          size="medium"
        >
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-xs text-muted-foreground w-14 shrink-0 pt-0.5">{event.time}</span>
                <p className="text-sm">{event.title}</p>
              </div>
            ))}
          </div>
        </WidgetCard>

        <WidgetCard 
          size="medium"
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
        >
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

        <WidgetCard 
          size="large"
          className="col-start-1 row-start-3"
        >
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
      </div>
    </div>
  );
}
