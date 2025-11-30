import { useState } from "react";
import { Newspaper, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  category: "tech" | "world" | "business" | "science";
  date: string;
  source: string;
  author: string;
  url: string;
}

const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title: "AI Breakthroughs Continue to Transform Industries",
    description: "Recent advancements in artificial intelligence are reshaping how businesses operate across sectors. Companies are investing heavily in AI infrastructure and talent.",
    content: "Recent advancements in artificial intelligence are reshaping how businesses operate across sectors, from healthcare to finance. Companies are investing heavily in AI infrastructure and talent.\n\nMajor tech firms have announced record investments in AI research and development. According to industry analysts, the global AI market is expected to reach $1.81 trillion by 2030.\n\nThe transformation is already visible in multiple industries. Healthcare providers are using AI for diagnostic assistance, financial institutions are deploying machine learning for fraud detection, and manufacturers are optimizing production with AI-powered systems.\n\nHowever, experts caution that businesses need to address ethical concerns and data privacy issues as AI adoption accelerates. Regulatory frameworks are still being developed to ensure responsible AI deployment.",
    category: "tech",
    date: "2 hours ago",
    source: "TechNews Daily",
    author: "Sarah Chen",
    url: "#"
  },
  {
    id: "2",
    title: "Global Markets React to Economic News",
    description: "Major stock indices moved following latest employment data. Analysts remain cautious about near-term outlook despite some positive indicators.",
    content: "Major stock indices moved following the latest employment data released this morning. The S&P 500 gained 2.3% while the Nasdaq dropped 0.8% on mixed tech sector performance.\n\nEmployment figures came in stronger than expected with 250,000 new jobs created last month. However, wage growth remained flat, raising concerns about inflationary pressures.\n\nAnalysts remain cautious about the near-term outlook despite some positive indicators. Bond markets are pricing in a potential interest rate cut by the Federal Reserve in coming months.\n\nInternational markets also showed volatility, with European indices down 1.2% on concerns about geopolitical tensions. Asian markets ended mixed with Japan's Nikkei up 0.5% while China's Shanghai Composite fell 1.8%.",
    category: "business",
    date: "4 hours ago",
    source: "Finance Weekly",
    author: "Michael Torres",
    url: "#"
  },
  {
    id: "3",
    title: "Scientists Discover New Exoplanet in Habitable Zone",
    description: "Using advanced telescopes, researchers have identified a potentially habitable planet orbiting a nearby star. The discovery opens new possibilities for studying distant worlds.",
    content: "Using advanced space telescopes and ground-based observations, an international team of researchers has identified a potentially habitable exoplanet orbiting a nearby star system just 39 light-years away.\n\nThe planet, designated K2-18c, orbits within the habitable zone of its parent star, meaning liquid water could exist on its surface. This makes it a prime candidate for future study and potential life-supporting conditions.\n\nThe discovery opens new possibilities for studying distant worlds and searching for signs of extraterrestrial life. The research team plans to conduct detailed spectral analysis of the planet's atmosphere using next-generation telescopes.\n\nScientists estimate there could be billions of habitable exoplanets in our galaxy alone. This discovery reinforces the importance of continued investment in astronomical research and next-generation observation technology.",
    category: "science",
    date: "6 hours ago",
    source: "Science Today",
    author: "Dr. James Wilson",
    url: "#"
  },
  {
    id: "4",
    title: "Tech Company Announces Major Sustainability Initiative",
    description: "A leading technology firm commits to achieving net-zero emissions by 2030. The company plans significant investments in renewable energy and carbon reduction.",
    content: "A leading technology company announced an ambitious sustainability initiative today, committing to achieve net-zero carbon emissions by 2030. The company plans significant investments in renewable energy infrastructure and carbon reduction strategies.\n\nThe initiative includes transitioning all data centers to 100% renewable energy within the next three years. The company will also implement a comprehensive recycling program for electronic waste and reduce plastic usage across all operations.\n\nThese commitments represent an investment of over $10 billion in sustainability measures. The company aims to become a leader in corporate environmental responsibility within the technology sector.\n\nIndustry observers note that this move puts pressure on competitors to announce similar initiatives. Environmental groups have praised the commitment while calling for transparent reporting on progress toward these goals.",
    category: "tech",
    date: "8 hours ago",
    source: "Green Tech",
    author: "Emma Richardson",
    url: "#"
  },
  {
    id: "5",
    title: "International Trade Negotiations Progress",
    description: "Countries reach preliminary agreement on key trade issues. Experts believe this could lead to reduced tariffs and increased commerce in coming months.",
    content: "Following weeks of intensive negotiations, countries have reached a preliminary agreement on key trade issues. The agreement includes provisions for reduced tariffs on technology products and agricultural goods.\n\nExperts believe this could lead to significantly increased commerce between member nations in coming months. Trade economists estimate the agreement could add $200 billion annually to global trade volume.\n\nThe negotiations included participation from major trading nations representing over 60% of global GDP. Key sticking points around intellectual property rights and labor standards were resolved through compromise proposals.\n\nHowever, some critics argue the agreement does not go far enough in addressing climate concerns. Environmental advocates are calling for additional sustainability requirements in future trade agreements.",
    category: "world",
    date: "10 hours ago",
    source: "World Affairs",
    author: "David Park",
    url: "#"
  },
  {
    id: "6",
    title: "Quantum Computing Milestone Achieved",
    description: "Researchers successfully demonstrate quantum computer solving problem faster than classical computers. The breakthrough could revolutionize computational science.",
    content: "Researchers at leading institutions have successfully demonstrated a quantum computer solving a complex mathematical problem significantly faster than the most advanced classical computers available.\n\nThe breakthrough represents a major milestone in quantum computing development. The quantum system performed calculations that would take traditional computers several thousand years to complete in under four hours.\n\nThis achievement could revolutionize computational science and lead to breakthroughs in drug discovery, materials science, and cryptography. However, researchers note that practical applications are still years away.\n\nThe quantum computer currently requires extreme cooling and specialized facilities to operate. Scaling up quantum technology and making it more practical remains a significant engineering challenge for the coming years.",
    category: "tech",
    date: "12 hours ago",
    source: "Tech Innovation",
    author: "Dr. Lisa Anderson",
    url: "#"
  },
  {
    id: "7",
    title: "Healthcare System Gets Digital Upgrade",
    description: "New digital health platform improves patient access and reduces wait times. Hospitals report 40% increase in appointment availability.",
    content: "A new comprehensive digital health platform has been successfully implemented across a major regional healthcare system. Early results show significant improvements in patient access and reduced wait times.\n\nHospitals report a 40% increase in appointment availability through online booking systems. Patient satisfaction scores have increased by 35% since the platform launch. The system includes telehealth capabilities, electronic health records integration, and AI-assisted diagnostic support.\n\nThe digital upgrade has also improved operational efficiency for healthcare providers. Staff report spending less time on administrative tasks and more time focused on patient care.\n\nThese improvements position the healthcare system as a leader in digital health innovation. The success of this initiative is expected to encourage similar digital transformations in other healthcare organizations.",
    category: "science",
    date: "1 day ago",
    source: "Health Weekly",
    author: "Dr. Robert Kim",
    url: "#"
  },
  {
    id: "8",
    title: "Global Climate Summit Produces New Commitments",
    description: "Nations agree on stronger climate action plans. New targets aim to limit global warming to 1.5 degrees Celsius.",
    content: "At the conclusion of the international climate summit, nations have agreed on stronger climate action plans with new targets aimed at limiting global warming to 1.5 degrees Celsius above pre-industrial levels.\n\nThe agreement includes specific commitments from developed nations to increase climate finance to developing countries. Major fossil fuel producing nations have agreed to accelerate renewable energy transitions.\n\nEnvironmental organizations are cautiously optimistic about the outcomes. However, critics argue the commitments still fall short of what is needed to prevent catastrophic climate impacts.\n\nImplementation will be critical in the coming years. Scientists emphasize that achieving these goals requires immediate action from governments, businesses, and individuals worldwide. The next decade is considered crucial for determining the climate future of our planet.",
    category: "world",
    date: "1 day ago",
    source: "Climate Watch",
    author: "Professor Emma Thompson",
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
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const filteredArticles = selectedCategory === "all" 
    ? MOCK_ARTICLES 
    : MOCK_ARTICLES.filter(article => article.category === selectedCategory);

  if (selectedArticle) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Detail Header */}
        <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full shrink-0"
            onClick={() => setSelectedArticle(null)}
            data-testid="button-article-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 truncate">Back to News</h1>
        </div>

        {/* Article Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-3xl mx-auto space-y-4">
            {/* Category Badge */}
            <div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  CATEGORY_COLORS[selectedArticle.category]
                }`}
                data-testid={`detail-tag-${selectedArticle.category}`}
              >
                {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="article-title">
                {selectedArticle.title}
              </h1>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pb-4 border-b border-border/50">
              <div>
                <span className="font-medium">By</span> {selectedArticle.author}
              </div>
              <div>
                <span className="font-medium">Source:</span> {selectedArticle.source}
              </div>
              <div>{selectedArticle.date}</div>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed text-foreground mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Back Button */}
            <div className="pt-6 border-t border-border/50">
              <Button
                onClick={() => setSelectedArticle(null)}
                className="w-full"
                data-testid="button-pull-back-more-news"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to More News
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

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
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full text-left bg-card/40 border border-border/50 rounded-xl p-4 hover-elevate transition-all"
                data-testid={`news-article-card-${article.id}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base leading-tight mb-1 hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                  </div>
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
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
