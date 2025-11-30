import { BookOpen } from "lucide-react";

interface BooksProps {
  onBack: () => void;
}

export function Books({ onBack }: BooksProps) {
  const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", progress: 65 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", progress: 45 },
    { title: "1984", author: "George Orwell", progress: 90 },
    { title: "Pride and Prejudice", author: "Jane Austen", progress: 20 },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex flex-col pt-20">
      <div className="flex items-center gap-4 px-6 mb-6">
        <BookOpen className="w-8 h-8 text-amber-400" />
        <h1 className="text-3xl font-bold">Books</h1>
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
