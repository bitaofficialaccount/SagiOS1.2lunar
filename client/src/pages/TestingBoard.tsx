import { Button } from "@/components/ui/button";
import { LogOut, Grid2X2, Mic, Keyboard } from "lucide-react";

interface TestingBoardProps {
  onLogout: () => void;
  onNavigateApp: (app: string) => void;
}

export function TestingBoard({ onLogout: onLogoutProp, onNavigateApp }: TestingBoardProps) {
  const handleLogout = () => {
    localStorage.removeItem("isTestingMode");
    localStorage.removeItem("setupComplete");
    localStorage.removeItem("currentUser");
    onLogoutProp();
  };
  const testApps = [
    { id: "browser", name: "Browser", color: "bg-blue-500/20" },
    { id: "photos", name: "Photos", color: "bg-pink-500/20" },
    { id: "weather", name: "Weather", color: "bg-cyan-500/20" },
    { id: "videos", name: "Videos", color: "bg-red-500/20" },
    { id: "music", name: "Music", color: "bg-purple-500/20" },
    { id: "mail", name: "Mail", color: "bg-indigo-500/20" },
    { id: "maps", name: "Maps", color: "bg-green-500/20" },
    { id: "news", name: "News", color: "bg-orange-500/20" },
    { id: "books", name: "Books", color: "bg-yellow-500/20" },
    { id: "calculator", name: "Calculator", color: "bg-teal-500/20" },
    { id: "notes", name: "Notes", color: "bg-amber-500/20" },
    { id: "files", name: "Files", color: "bg-sky-500/20" },
  ];

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10 flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">SAGI Testing Board</h1>
            <p className="text-muted-foreground">Test all apps and features</p>
          </div>
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full"
            onClick={handleLogout}
            data-testid="button-testing-logout"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-3 gap-4 pb-6">
            {testApps.map((app) => (
              <Button
                key={app.id}
                variant="secondary"
                className={`h-24 rounded-xl flex flex-col items-center justify-center gap-2 ${app.color}`}
                onClick={() => onNavigateApp(app.id)}
                data-testid={`button-test-app-${app.id}`}
              >
                <Grid2X2 className="w-6 h-6" />
                <span className="text-sm font-semibold">{app.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-auto pt-6 border-t border-border/50">
          <div className="bg-card/40 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Keyboard className="w-5 h-5 text-primary" />
              <p className="font-semibold">Keyboard</p>
            </div>
            <p className="text-sm text-muted-foreground">Always available globally</p>
          </div>
          <div className="bg-card/40 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-5 h-5 text-primary" />
              <p className="font-semibold">Voice</p>
            </div>
            <p className="text-sm text-muted-foreground">Say "Hey, Sagi"</p>
          </div>
          <div className="bg-card/40 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Grid2X2 className="w-5 h-5 text-primary" />
              <p className="font-semibold">Apps</p>
            </div>
            <p className="text-sm text-muted-foreground">Swipe up to open drawer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
