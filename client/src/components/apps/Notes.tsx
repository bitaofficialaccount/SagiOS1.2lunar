import { useState } from "react";
import { Plus, Trash2, FileText } from "lucide-react";
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

export function Notes() {
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
    <div className="flex h-full">
      <div className="w-48 border-r border-border flex flex-col">
        <div className="p-2 border-b border-border">
          <Button 
            className="w-full gap-2" 
            size="sm"
            onClick={createNote}
            data-testid="button-new-note"
          >
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {notes.map((note) => (
              <button
                key={note.id}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  selectedNote?.id === note.id 
                    ? "bg-primary/20 text-foreground" 
                    : "hover-elevate"
                }`}
                onClick={() => setSelectedNote(note)}
                data-testid={`note-item-${note.id}`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm truncate">{note.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
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
            <div className="flex items-center gap-2 p-3 border-b border-border">
              {editingTitle ? (
                <Input
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
                  className="flex-1"
                  autoFocus
                  data-testid="input-note-title"
                />
              ) : (
                <h2 
                  className="flex-1 font-medium cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setEditingTitle(true)}
                  data-testid="text-note-title"
                >
                  {selectedNote.title}
                </h2>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteNote(selectedNote.id)}
                data-testid="button-delete-note"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Textarea
              value={selectedNote.content}
              onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
              placeholder="Start typing..."
              className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 text-sm"
              data-testid="textarea-note-content"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select or create a note</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
