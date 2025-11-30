import { Newspaper, ExternalLink } from "lucide-react";

interface NewsProps {
  onBack: () => void;
}

export function News({ onBack }: NewsProps) {
  const articles = [
    { title: "Tech Industry Sees Record Growth", source: "TechNews", time: "2 hours ago" },
    { title: "New Scientific Discovery Announced", source: "Science Daily", time: "4 hours ago" },
    { title: "Global Markets Report", source: "Finance Times", time: "6 hours ago" },
    { title: "Weather Advisory Updates", source: "Weather Report", time: "8 hours ago" },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <Newspaper className="w-8 h-8 text-orange-400" />
        <h1 className="text-3xl font-bold">News</h1>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto">
        <div className="space-y-4">
          {articles.map((article, idx) => (
            <div key={idx} className="p-4 bg-card/40 rounded-xl border border-border/50 hover-elevate cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.source} • {article.time}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
