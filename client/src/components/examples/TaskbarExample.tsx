import { Taskbar, defaultApps } from "../os/Taskbar";

export default function TaskbarExample() {
  const apps = defaultApps.map((app, i) => ({
    ...app,
    isOpen: i < 2,
    isMinimized: i === 1,
  }));

  return (
    <div className="relative h-[100px] bg-background">
      <div className="absolute bottom-0 left-0 right-0">
        <Taskbar
          apps={apps}
          voiceState="idle"
          onAppClick={(id) => console.log("App clicked:", id)}
          onVoiceClick={() => console.log("Voice clicked")}
          onStartClick={() => console.log("Start clicked")}
        />
      </div>
    </div>
  );
}
