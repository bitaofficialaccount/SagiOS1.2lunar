import { useState } from "react";
import { Plus, Trash2, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface NotesProps {
  onBack?: () => void;
}

export function Notes({ onBack }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Welcome to Notes",
      content: "Start typing to create your first note. You can use voice commands to open and interact with this app!",
      updatedAt: new Date(),
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [editingTitle, setEditingTitle] = useState(false);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditingTitle(true);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, ...updates, updatedAt: new Date() });
    }
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    if (selectedNote?.id === id) {
      setSelectedNote(newNotes[0] || null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        {onBack && (
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full shrink-0"
            onClick={onBack}
            data-testid="button-notes-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold flex-1">Notes</h1>
        <Button 
          className="gap-2 h-12 px-6 rounded-full" 
          onClick={createNote}
          data-testid="button-new-note"
        >
          <Plus className="w-5 h-5" />
          New
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
      <div className="w-64 border-r border-border flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {notes.map((note) => (
              <button
                key={note.id}
                className={`w-full text-left p-4 rounded-xl transition-colors ${
                  selectedNote?.id === note.id 
                    ? "bg-primary/20 text-foreground" 
                    : "hover-elevate active-elevate-2"
                }`}
                onClick={() => setSelectedNote(note)}
                data-testid={`note-item-${note.id}`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-base truncate">{note.title}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 truncate">
                  {formatDate(note.updatedAt)}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-border">
              {editingTitle ? (
                <Input
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
                  className="flex-1 h-12 text-lg"
                  autoFocus
                  data-testid="input-note-title"
                />
              ) : (
                <h2 
                  className="flex-1 text-lg font-medium cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setEditingTitle(true)}
                  data-testid="text-note-title"
                >
                  {selectedNote.title}
                </h2>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="w-12 h-12 rounded-full"
                onClick={() => deleteNote(selectedNote.id)}
                data-testid="button-delete-note"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </Button>
            </div>
            <Textarea
              value={selectedNote.content}
              onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
              placeholder="Start typing..."
              className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 text-base p-4"
              data-testid="textarea-note-content"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select or create a note</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
