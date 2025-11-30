import { BookOpen, Settings, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BooksProps {
  onBack: () => void;
}

const bookProviders = [
  { id: "kindle", name: "Amazon Kindle", url: "https://www.amazon.com/kindle" },
  { id: "apple", name: "Apple Books", url: "https://books.apple.com" },
  { id: "google", name: "Google Play Books", url: "https://play.google.com/books" },
  { id: "scribd", name: "Scribd", url: "https://www.scribd.com" },
  { id: "wattpad", name: "Wattpad", url: "https://www.wattpad.com" },
];

export function Books({ onBack }: BooksProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(() => {
    return localStorage.getItem("booksProvider") || null;
  });

  const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", progress: 65 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", progress: 45 },
    { title: "1984", author: "George Orwell", progress: 90 },
    { title: "Pride and Prejudice", author: "Jane Austen", progress: 20 },
  ];

  const handleSelectProvider = (providerId: string) => {
    localStorage.setItem("booksProvider", providerId);
    setSelectedProvider(providerId);
  };

  const currentProvider = bookProviders.find(p => p.id === selectedProvider);

  if (!selectedProvider) {
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
                onClick={() => {
                  handleSelectProvider(provider.id);
                  window.location.href = `/api/proxy?url=${encodeURIComponent(provider.url)}`;
                }}
                data-testid={`button-provider-${provider.id}`}
              >
                {provider.name}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center justify-between px-6 mb-6">
        <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-3xl font-bold">Books</h1>
            <p className="text-sm text-muted-foreground">{currentProvider?.name}</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            localStorage.removeItem("booksProvider");
            setSelectedProvider(null);
          }}
          data-testid="button-change-provider"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-auto">
        <div className="space-y-4">
          {books.map((book, idx) => (
            <div key={idx} className="p-4 bg-card/40 rounded-xl border border-border/50 hover-elevate cursor-pointer">
              <p className="font-semibold mb-1">{book.title}</p>
              <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{book.progress}% completed</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
