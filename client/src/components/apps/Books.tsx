import { BookOpen, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface BooksProps {
  onBack: () => void;
}

const bookProviders = [
  { id: "kindle", name: "Amazon Kindle", url: "https://read.amazon.com" },
  { id: "apple", name: "Apple Books", url: "https://books.apple.com" },
  { id: "google", name: "Google Play Books", url: "https://play.google.com/books" },
  { id: "scribd", name: "Scribd", url: "https://www.scribd.com" },
  { id: "wattpad", name: "Wattpad", url: "https://www.wattpad.com" },
];

export function Books({ onBack }: BooksProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(() => {
    return localStorage.getItem("booksProvider") || null;
  });
  const [selectedUrl, setSelectedUrl] = useState<string | null>(() => {
    const saved = localStorage.getItem("booksProvider");
    if (saved) {
      const provider = bookProviders.find(p => p.id === saved);
      return provider?.url || null;
    }
    return null;
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSelectProvider = (providerId: string) => {
    const provider = bookProviders.find(p => p.id === providerId);
    if (provider) {
      localStorage.setItem("booksProvider", providerId);
      setSelectedProvider(providerId);
      setSelectedUrl(provider.url);
    }
  };

  const handleBack = () => {
    localStorage.removeItem("booksProvider");
    setSelectedProvider(null);
    setSelectedUrl(null);
  };

  const currentProvider = bookProviders.find(p => p.id === selectedProvider);

  if (!selectedUrl) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
        <div className="flex items-center gap-4 px-6 mb-6">
          <BookOpen className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold">Books</h1>
        </div>

        <div className="flex-1 px-6 pb-20 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-6">Choose Your Book Provider</h2>
          <div className="w-full max-w-sm space-y-3">
            {bookProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="secondary"
                className="w-full h-14 text-lg"
                onClick={() => handleSelectProvider(provider.id)}
                data-testid={`button-provider-${provider.id}`}
              >
                {provider.name}
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={onBack}
          data-testid="button-books-back-app"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 rounded-full shrink-0"
          onClick={handleBack}
          data-testid="button-books-change-provider"
        >
          <BookOpen className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold">{currentProvider?.name || "Books"}</h1>
      </div>

      <div className="flex-1 bg-background overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`/api/proxy?url=${encodeURIComponent(selectedUrl)}`}
          className="w-full h-full border-0"
          title="Book Provider"
          data-testid="iframe-books"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
        />
      </div>
    </div>
  );
}
