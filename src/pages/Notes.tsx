import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pin, Trash2, Pencil } from "lucide-react";
import { Note } from "@/types";
import { STORAGE_KEYS, addXP, XP_REWARDS } from "@/lib/gameLogic";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (!newNote.title.trim()) {
      toast.error("Note title is required!");
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      ...newNote,
      pinned: false,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveNotes([...notes, note]);
    setNewNote({ title: "", content: "" });
    setIsAdding(false);
    addXP(XP_REWARDS.NOTE_CREATE);
    toast.success(`Note created! +${XP_REWARDS.NOTE_CREATE} XP`);
  };

  const togglePin = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
    toast.info("Note deleted");
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
  };

  const handleUpdateNote = () => {
    if (!editingNote || !editingNote.title.trim()) {
      toast.error("Note title is required!");
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id 
        ? { ...editingNote, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
    setEditingNote(null);
    toast.success("Note updated successfully");
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notes</h1>
            <p className="text-muted-foreground">Capture your thoughts and ideas</p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Add Note Form */}
        {isAdding && (
          <Card className="p-6 bg-gradient-card border-border shadow-card animate-scale-in">
            <h3 className="text-lg font-semibold mb-4">Create New Note</h3>
            <div className="space-y-4">
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <Textarea
                placeholder="Write your thoughts..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddNote} className="flex-1 bg-success hover:bg-success/90">
                  Save Note
                </Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.length === 0 ? (
            <Card className="col-span-full p-12 text-center bg-gradient-card border-border">
              <p className="text-muted-foreground">No notes yet. Create one to get started!</p>
            </Card>
          ) : (
            sortedNotes.map((note) => (
              <Card
                key={note.id}
                className={`p-4 bg-gradient-card border-border shadow-card hover:shadow-elevated transition-all duration-200 ${
                  note.pinned ? "ring-2 ring-xp" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg flex-1">{note.title}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePin(note.id)}
                      className={note.pinned ? "text-xp" : "text-muted-foreground"}
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(note)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {note.content && (
                  <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
                )}
                <div className="mt-3 text-xs text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Edit Note Dialog */}
        <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Note title"
                value={editingNote?.title || ""}
                onChange={(e) => setEditingNote(editingNote ? { ...editingNote, title: e.target.value } : null)}
              />
              <Textarea
                placeholder="Content"
                value={editingNote?.content || ""}
                onChange={(e) => setEditingNote(editingNote ? { ...editingNote, content: e.target.value } : null)}
                rows={8}
              />
              <div className="flex gap-2">
                <Button onClick={handleUpdateNote} className="flex-1">
                  Update Note
                </Button>
                <Button variant="outline" onClick={() => setEditingNote(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
