import { useState, useCallback } from 'react';
import { Note } from '@/types/supabase';

/**
 * Custom hook to manage note dialog states and actions
 * 
 * @returns State and handlers for note dialogs
 */
export function useNoteDialogs() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  
  const handleDeleteNote = useCallback((id: string) => {
    setNoteToDelete(id);
    setIsDeleteDialogOpen(true);
  }, []);
  
  return {
    selectedNote,
    isViewDialogOpen,
    isCreateDialogOpen,
    isDeleteDialogOpen,
    noteToDelete,
    setSelectedNote,
    setIsViewDialogOpen,
    setIsCreateDialogOpen,
    setIsDeleteDialogOpen,
    setNoteToDelete,
    handleDeleteNote
  };
}