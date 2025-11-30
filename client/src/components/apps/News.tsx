import { useState } from "react";
import { Newspaper, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  category: "tech" | "world" | "business" | "science";
  date: string;
  source: string;
  url: string;
}

const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title: "AI Breakthroughs Continue to Transform Industries",
    description: "Recent advancements in artificial intelligence are reshaping how businesses operate across sectors. Companies are investing heavily in AI infrastructure and talent.",
    category: "tech",
    date: "2 hours ago",
    source: "TechNews Daily",
    url: "#"
  },
  {
    id: "2",
    title: "Global Markets React to Economic News",
    description: "Major stock indices moved following latest employment data. Analysts remain cautious about near-term outlook despite some positive indicators.",
    category: "business",
    date: "4 hours ago",
    source: "Finance Weekly",
    url: "#"
  },
  {
    id: "3",
    title: "Scientists Discover New Exoplanet in Habitable Zone",
    description: "Using advanced telescopes, researchers have identified a potentially habitable planet orbiting a nearby star. The discovery opens new possibilities for studying distant worlds.",
    category: "science",
    date: "6 hours ago",
    source: "Science Today",
    url: "#"
  },
  {
    id: "4",
    title: "Tech Company Announces Major Sustainability Initiative",
    description: "A leading technology firm commits to achieving net-zero emissions by 2030. The company plans significant investments in renewable energy and carbon reduction.",
    category: "tech",
    date: "8 hours ago",
    source: "Green Tech",
    url: "#"
  },
  {
    id: "5",
    title: "International Trade Negotiations Progress",
    description: "Countries reach preliminary agreement on key trade issues. Experts believe this could lead to reduced tariffs and increased commerce in coming months.",
    category: "world",
    date: "10 hours ago",
    source: "World Affairs",
    url: "#"
  },
  {
    id: "6",
    title: "Quantum Computing Milestone Achieved",
    description: "Researchers successfully demonstrate quantum computer solving problem faster than classical computers. The breakthrough could revolutionize computational science.",
    category: "tech",
    date: "12 hours ago",
    source: "Tech Innovation",
    url: "#"
  },
  {
    id: "7",
    title: "Healthcare System Gets Digital Upgrade",
    description: "New digital health platform improves patient access and reduces wait times. Hospitals report 40% increase in appointment availability.",
    category: "science",
    date: "1 day ago",
    source: "Health Weekly",
    url: "#"
  },
  {
    id: "8",
    title: "Global Climate Summit Produces New Commitments",
    description: "Nations agree on stronger climate action plans. New targets aim to limit global warming to 1.5 degrees Celsius.",
    category: "world",
    date: "1 day ago",
    source: "Climate Watch",
    url: "#"
  },
];

const CATEGORIES = [
  { id: "all", name: "All News" },
  { id: "tech", name: "Technology" },
  { id: "business", name: "Business" },
  { id: "science", name: "Science" },
  { id: "world", name: "World" },
];

const CATEGORY_COLORS: { [key: string]: string } = {
  tech: "bg-blue-500/20 text-blue-400",
  business: "bg-green-500/20 text-green-400",
  science: "bg-purple-500/20 text-purple-400",
  world: "bg-orange-500/20 text-orange-400",
};

interface NewsProps {
  onBack: () => void;
}

export function News({ onBack }: NewsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = selectedCategory === "all" 
    ? MOCK_ARTICLES 
    : MOCK_ARTICLES.filter(article => article.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={onBack}
          data-testid="button-news-back"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Newspaper className="w-6 h-6 text-orange-400" />
        <h1 className="text-xl font-semibold flex-1">News Feed</h1>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 p-4 bg-card/50 border-b border-border/50 overflow-x-auto">
        {CATEGORIES.map(category => (
          <Button
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
            data-testid={`button-category-${category.id}`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Articles List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No articles found for this category
            </div>
          ) : (
            filteredArticles.map(article => (
              <div
                key={article.id}
                className="bg-card/40 border border-border/50 rounded-xl p-4 hover-elevate transition-all"
                data-testid={`news-article-${article.id}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base leading-tight mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {article.description}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="flex-shrink-0"
                    onClick={() => window.open(article.url, '_blank')}
                    data-testid={`button-read-more-${article.id}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        CATEGORY_COLORS[article.category]
                      }`}
                      data-testid={`tag-category-${article.category}`}
                    >
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.source}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {article.date}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
