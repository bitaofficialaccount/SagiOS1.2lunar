import { useState } from "react";
import { 
  Folder, 
  FileText, 
  Image, 
  Music, 
  Video, 
  File, 
  ChevronRight, 
  ChevronDown,
  Home,
  HardDrive,
  Download,
  Star,
  ArrowLeft
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  icon?: "image" | "music" | "video" | "document";
  children?: FileItem[];
}

const mockFileSystem: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    children: [
      { id: "1-1", name: "Resume.pdf", type: "file", icon: "document" },
      { id: "1-2", name: "Project Notes.txt", type: "file", icon: "document" },
      {
        id: "1-3",
        name: "Work",
        type: "folder",
        children: [
          { id: "1-3-1", name: "Report.docx", type: "file", icon: "document" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Pictures",
    type: "folder",
    children: [
      { id: "2-1", name: "vacation.jpg", type: "file", icon: "image" },
      { id: "2-2", name: "profile.png", type: "file", icon: "image" },
    ],
  },
  {
    id: "3",
    name: "Music",
    type: "folder",
    children: [
      { id: "3-1", name: "favorite_song.mp3", type: "file", icon: "music" },
    ],
  },
  {
    id: "4",
    name: "Videos",
    type: "folder",
    children: [
      { id: "4-1", name: "tutorial.mp4", type: "file", icon: "video" },
    ],
  },
];

const getFileIcon = (item: FileItem) => {
  if (item.type === "folder") return <Folder className="w-5 h-5 text-accent" />;
  switch (item.icon) {
    case "image":
      return <Image className="w-5 h-5 text-green-400" />;
    case "music":
      return <Music className="w-5 h-5 text-purple-400" />;
    case "video":
      return <Video className="w-5 h-5 text-red-400" />;
    case "document":
      return <FileText className="w-5 h-5 text-blue-400" />;
    default:
      return <File className="w-5 h-5 text-muted-foreground" />;
  }
};

function FolderTree({ 
  items, 
  level = 0, 
  selectedId,
  onSelect 
}: { 
  items: FileItem[];
  level?: number;
  selectedId: string | null;
  onSelect: (item: FileItem) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["1"]));

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (expanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  return (
    <div className="space-y-0.5">
      {items.map((item) => (
        <div key={item.id}>
          <button
            className={`w-full flex items-center gap-1 px-2 py-1.5 rounded-md text-sm transition-colors ${
              selectedId === item.id 
                ? "bg-primary/20 text-foreground" 
                : "hover-elevate"
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => {
              onSelect(item);
              if (item.type === "folder") {
                toggleExpand(item.id);
              }
            }}
            data-testid={`file-item-${item.id}`}
          >
            {item.type === "folder" && (
              <span className="w-4 h-4 flex items-center justify-center">
                {expanded.has(item.id) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </span>
            )}
            {item.type === "file" && <span className="w-4" />}
            {getFileIcon(item)}
            <span className="truncate">{item.name}</span>
          </button>
          {item.type === "folder" && item.children && expanded.has(item.id) && (
            <FolderTree 
              items={item.children} 
              level={level + 1} 
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface FileManagerProps {
  onBack?: () => void;
}

export function FileManager({ onBack }: FileManagerProps) {
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);

  const sidebarItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Star, label: "Favorites", id: "favorites" },
    { icon: Download, label: "Downloads", id: "downloads" },
    { icon: HardDrive, label: "This PC", id: "pc" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-md border-b border-border/50">
        {onBack && (
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full shrink-0"
            onClick={onBack}
            data-testid="button-files-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">Files</h1>
      </div>
    <div className="flex flex-1 overflow-hidden">
      <div className="w-52 border-r border-border p-3">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-base hover-elevate active-elevate-2"
              data-testid={`sidebar-${item.id}`}
            >
              <item.icon className="w-5 h-5 text-primary" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="h-px bg-border my-3" />
        <p className="px-3 text-sm text-muted-foreground mb-2">Quick Access</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border text-base text-muted-foreground">
          <Home className="w-5 h-5" />
          <ChevronRight className="w-4 h-4" />
          <span>Files</span>
          {selectedItem && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{selectedItem.name}</span>
            </>
          )}
        </div>
        <ScrollArea className="flex-1 p-3">
          <FolderTree 
            items={mockFileSystem} 
            selectedId={selectedItem?.id || null}
            onSelect={setSelectedItem}
          />
        </ScrollArea>
      </div>

      {selectedItem && (
        <div className="w-48 border-l border-border p-3">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center mb-2">
              {getFileIcon(selectedItem)}
            </div>
            <p className="text-sm font-medium break-all">{selectedItem.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{selectedItem.type}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>{selectedItem.type === "folder" ? "Folder" : selectedItem.icon || "File"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size</span>
              <span>{selectedItem.type === "folder" ? "--" : "2.4 KB"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
