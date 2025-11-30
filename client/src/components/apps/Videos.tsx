import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideosProps {
  onBack: () => void;
}

export function Videos({ onBack }: VideosProps) {
  const videos = [
    { title: "Nature Documentary", duration: "45:32" },
    { title: "Travel Vlog", duration: "28:15" },
    { title: "Tutorial", duration: "12:45" },
    { title: "Music Video", duration: "3:45" },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <h1 className="text-3xl font-bold">Videos</h1>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto">
        <div className="space-y-4">
          {videos.map((video, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-card/40 rounded-xl border border-border/50 hover-elevate cursor-pointer">
              <div className="w-20 h-20 bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{video.title}</p>
                <p className="text-sm text-muted-foreground">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
