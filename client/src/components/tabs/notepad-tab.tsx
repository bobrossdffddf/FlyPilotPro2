import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Note, InsertNote } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NotepadTab() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: InsertNote) => {
      const response = await apiRequest("POST", "/api/notes", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertNote> }) => {
      const response = await apiRequest("PATCH", `/api/notes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both a title and content for the note.",
        variant: "destructive",
      });
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      flightNumber: flightNumber.trim() || null,
    };

    if (currentNote) {
      updateNoteMutation.mutate({
        id: currentNote.id,
        data: noteData,
      });
    } else {
      createNoteMutation.mutate(noteData);
    }
  };

  const handleNewNote = () => {
    setCurrentNote(null);
    setTitle("");
    setContent("");
    setFlightNumber("");
  };

  const handleLoadNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
    setFlightNumber(note.flightNumber || "");
  };

  // Auto-save functionality
  useEffect(() => {
    if (currentNote && (title !== currentNote.title || content !== currentNote.content || flightNumber !== (currentNote.flightNumber || ""))) {
      const timeoutId = setTimeout(() => {
        if (title.trim() && content.trim()) {
          updateNoteMutation.mutate({
            id: currentNote.id,
            data: {
              title: title.trim(),
              content: content.trim(),
              flightNumber: flightNumber.trim() || null,
            },
          });
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [title, content, flightNumber, currentNote]);

  return (
    <div className="h-full">
      <header className="bg-panel-bg border-b border-panel-gray p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary" data-testid="page-title">
              Digital Notepad
            </h2>
            <p className="text-text-muted mt-1">Flight notes and observations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleNewNote}
              variant="outline"
              className="border-panel-gray text-text-secondary hover:text-text-primary"
              data-testid="button-new-note"
            >
              <i className="fas fa-plus mr-2"></i>New
            </Button>
            <Button
              onClick={handleSave}
              disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
              data-testid="button-save-note"
            >
              <i className="fas fa-save mr-2"></i>
              {createNoteMutation.isPending || updateNoteMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Notes List Sidebar */}
        <div className="w-80 bg-panel-bg border-r border-panel-gray p-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4" data-testid="notes-list-title">
            Recent Notes
          </h3>
          <div className="space-y-2" data-testid="notes-list">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-text-muted" data-testid="empty-notes">
                <i className="fas fa-sticky-note text-4xl mb-2"></i>
                <p className="text-sm">No notes yet</p>
              </div>
            ) : (
              notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleLoadNote(note)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentNote?.id === note.id
                      ? "bg-aviation-blue/20 border border-aviation-blue"
                      : "bg-panel-gray/30 hover:bg-panel-gray/50"
                  }`}
                  data-testid={`note-${note.id}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-text-primary text-sm truncate">
                      {note.title}
                    </h4>
                    {note.flightNumber && (
                      <span className="text-xs bg-aviation-blue/20 text-aviation-blue px-1 py-0.5 rounded font-mono ml-2">
                        {note.flightNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">
                    {note.content}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1 p-6">
          <div className="bg-panel-bg rounded-xl border border-panel-gray p-6 h-full flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Note Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  className="bg-panel-gray border-panel-gray text-text-primary placeholder-text-muted"
                  data-testid="input-note-title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Flight Number (Optional)
                </label>
                <Input
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g., AA1234"
                  className="bg-panel-gray border-panel-gray text-text-primary placeholder-text-muted font-mono"
                  data-testid="input-flight-number"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Content
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your flight notes here..."
                className="w-full h-full resize-none bg-transparent border-panel-gray text-text-primary font-mono text-sm leading-relaxed focus:ring-aviation-blue"
                data-testid="textarea-note-content"
              />
            </div>
            
            {(createNoteMutation.isPending || updateNoteMutation.isPending) && (
              <div className="mt-2 text-sm text-aviation-blue" data-testid="saving-indicator">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Auto-saving...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
