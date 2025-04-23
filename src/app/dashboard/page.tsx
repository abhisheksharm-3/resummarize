'use client';

import { useState } from 'react';
import { useNotes, useDeleteNote, useCreateNote } from '@/hooks/useNotes';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Search } from 'lucide-react';
import { Note, InsertNote } from '@/types/supabase';
import { NoteCard } from '@/components/notes/NoteCard';
import { Navbar } from '@/components/layout/Navbar';
import { useUser } from '@/hooks/useUser';
import { NoteViewEditDialog } from '@/components/notes/NoteViewEditDialog.tsx';

export default function Dashboard() {
  const { data: notes = [], isLoading } = useNotes();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { data: user } = useUser();
  
  // State for viewing/editing an existing note
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // State for creating a new note
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenNote = (note: Note) => {
    setSelectedNote(note);
    setIsViewDialogOpen(true);
  };
  
  const handleCreateNoteClick = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleSaveNewNote = () => {
    if (!user) return;
    
    const newNote: InsertNote = {
      title: newNoteTitle,
      content: newNoteContent,
      user_id: user.id
    };
    
    createNote(newNote, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewNoteTitle('');
        setNewNoteContent('');
      }
    });
  };
  
  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      if (selectedNote?.id === id) {
        setIsViewDialogOpen(false);
      }
    }
  };
  
  return (
    <div className="container py-8 px-8 lg:px-24">
      <Navbar />
      <div className="flex flex-col gap-8">
        {/* Top section with summary dashboard */}
        <DashboardSummary notes={notes} />
        
        {/* Notes section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Notes</h2>
            <Button onClick={handleCreateNoteClick}>
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Notes grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onOpenNote={handleOpenNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              {searchTerm ? 'No notes match your search' : 'No notes yet. Create your first note!'}
            </div>
          )}
        </div>
      </div>
      
      {/* View/Edit Note Dialog */}
      <NoteViewEditDialog
        note={selectedNote}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        onDelete={handleDeleteNote}
      />
      
      {/* Create Note Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="text-lg font-medium"
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[300px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNewNote} 
              disabled={isCreating || !newNoteTitle.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Note'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}