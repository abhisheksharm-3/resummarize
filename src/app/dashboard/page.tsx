'use client';

import { useState } from 'react';
import { useNotes, useDeleteNote } from '@/hooks/useNotes';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search } from 'lucide-react';
import { Note } from '@/types/supabase';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteEditor } from '@/components/notes/NoteEditor';

export default function Dashboard() {
  const { data: notes = [], isLoading } = useNotes();
  const { mutate: deleteNote } = useDeleteNote();
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };
  
  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  };
  
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(undefined);
  };
  
  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Top section with summary dashboard */}
        <DashboardSummary notes={notes} />
        
        {/* Notes section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Notes</h2>
            <Button onClick={handleCreateNote}>
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
                  onEdit={handleEditNote}
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
      
      {/* Note Editor Dialog */}
      <NoteEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        note={editingNote}
      />
    </div>
  );
}