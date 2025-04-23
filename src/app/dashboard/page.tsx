'use client';

import { useState, useMemo, useCallback } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { Loader2 } from 'lucide-react';
import { Note } from '@/types/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { NoteViewEditDialog } from '@/components/notes/NoteViewEditDialog.tsx';
import { ChatbotFloating } from '@/components/chatbot/ChatbotFloating';
import { NotesHeader } from '@/components/dashboard/NotesHeader';
import { NotesSearchBar } from '@/components/dashboard/NotesSearchBar';
import { NotesGrid } from '@/components/dashboard/NotesGrid';
import { CreateNoteDialog } from '@/components/notes/CreateNoteDialog';
import { DeleteNoteDialog } from '@/components/notes/DeleteNoteDialog';
import { useNoteDialogs } from '@/hooks/useNoteDialogs';

/**
 * Dashboard component that displays and manages user notes
 * 
 * @description Main dashboard interface displaying a summary of notes,
 * a searchable notes grid, and dialogs for creating, viewing, editing,
 * and deleting notes
 * 
 * @returns Dashboard page component
 */
export default function Dashboard() {
  const { data: notes = [], isLoading } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    selectedNote,
    isViewDialogOpen,
    isCreateDialogOpen,
    isDeleteDialogOpen,
    noteToDelete,
    setSelectedNote,
    setIsViewDialogOpen,
    setIsCreateDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteNote
  } = useNoteDialogs();

  // Memoize filtered notes to avoid unnecessary recalculations
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerSearchTerm) || 
      note.content.toLowerCase().includes(lowerSearchTerm)
    );
  }, [notes, searchTerm]);
  
  // Callbacks for note interactions
  const handleOpenNote = useCallback((note: Note) => {
    setSelectedNote(note);
    setIsViewDialogOpen(true);
  }, [setSelectedNote, setIsViewDialogOpen]);
  
  const handleCreateNoteClick = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, [setIsCreateDialogOpen]);
  
  return (
    <div className="py-8 px-4 sm:px-8 lg:px-24 flex items-center justify-center flex-col w-full">
      <Navbar />
      <div className="flex flex-col gap-8 w-full max-w-7xl">
        {/* Top section with summary dashboard */}
        <DashboardSummary notes={notes} />
        
        {/* Notes section */}
        <div className="space-y-4">
          <NotesHeader onCreateNote={handleCreateNoteClick} />
          
          {/* Search bar */}
          <NotesSearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          {/* Notes grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <NotesGrid 
              notes={filteredNotes}
              searchTerm={searchTerm}
              onOpenNote={handleOpenNote}
              onDeleteNote={handleDeleteNote}
            />
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
      <CreateNoteDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        noteId={noteToDelete}
        onNoteDeleted={() => {
          if (selectedNote?.id === noteToDelete) {
            setIsViewDialogOpen(false);
          }
        }}
      />
      
      {/* Chatbot Assistant */}
      <ChatbotFloating notes={notes} />
    </div>
  );
}