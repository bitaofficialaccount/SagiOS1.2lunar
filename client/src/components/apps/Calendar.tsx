import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  title: string;
}

const EVENTS_STORAGE_KEY = "sagiCalendarEvents";

export function Calendar({ onBack }: { onBack: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("09:00");

  useEffect(() => {
    const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !eventTitle.trim()) return;
    
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      time: eventTime,
      title: eventTitle,
    };
    
    setEvents([...events, newEvent]);
    setEventTitle("");
    setEventTime("09:00");
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const dateStr = selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : null;
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={onBack}
          data-testid="button-calendar-back"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold">Calendar</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 w-full">
        <div className="w-full max-w-4xl mx-auto">
          {/* Calendar View */}
          <div className="bg-card/40 rounded-2xl border border-border/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={previousMonth}
                  data-testid="button-prev-month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={nextMonth}
                  data-testid="button-next-month"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = getDateString(day);
                const dayEvents = getEventsForDate(dateStr);
                const isToday = new Date().toDateString() === new Date(dateStr).toDateString();
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square p-2 rounded-lg border transition-all flex flex-col items-center justify-center text-sm font-medium ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : isToday
                        ? "bg-secondary/50 border-primary"
                        : "bg-secondary/20 border-border/50 hover:bg-secondary/30"
                    }`}
                    data-testid={`calendar-day-${day}`}
                  >
                    <span>{day}</span>
                    {dayEvents.length > 0 && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-card/40 rounded-2xl border border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{dateStr}</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  data-testid="button-add-event"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {/* Add Event Form */}
              {showAddEvent && (
                <div className="bg-secondary/20 rounded-xl p-4 mb-4 space-y-3 border border-border/50">
                  <Input
                    placeholder="Event title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="rounded-lg"
                    data-testid="input-event-title"
                  />
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="flex-1 px-3 py-2 bg-background border border-border/50 rounded-lg text-foreground"
                      data-testid="input-event-time"
                    />
                    <Button
                      onClick={handleAddEvent}
                      disabled={!eventTitle.trim()}
                      data-testid="button-save-event"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {/* Events List */}
              <div className="space-y-2">
                {selectedDateEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No events scheduled</p>
                ) : (
                  selectedDateEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50 hover-elevate"
                      data-testid={`event-${event.id}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteEvent(event.id)}
                        data-testid={`button-delete-event-${event.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
