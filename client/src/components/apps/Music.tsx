import { Music as MusicIcon, Play } from "lucide-react";

interface MusicAppProps {
  onBack: () => void;
}

export function Music({ onBack }: MusicAppProps) {
  const songs = [
    { title: "Summer Vibes", artist: "Artist Name", duration: "3:24" },
    { title: "Midnight", artist: "Artist Name", duration: "4:12" },
    { title: "Sunset", artist: "Artist Name", duration: "3:58" },
    { title: "Aurora", artist: "Artist Name", duration: "4:45" },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <MusicIcon className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold">Music</h1>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto">
        <div className="space-y-3">
          {songs.map((song, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-card/40 rounded-xl border border-border/50 hover-elevate cursor-pointer">
              <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{song.title}</p>
                <p className="text-sm text-muted-foreground">{song.artist} • {song.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
