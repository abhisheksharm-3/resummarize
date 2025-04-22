"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "@/controllers/NotesController";

export function useNotes() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch all notes
  const {
    data: notes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getAllNotes(),
    enabled: !!user, // Only fetch if user is authenticated
  });
  
  // Get a specific note by ID
  const getNote = async (noteId: string) => {
    try {
      const note = await getNoteById(noteId);
      return { note, error: null };
    } catch (error: unknown) {
      return { note: null, error };
    }
  };
  
  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: (noteData: { title: string; content: string }) =>
      createNote(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  
  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, noteData }: { 
      noteId: string, 
      noteData: { title?: string; content?: string } 
    }) => updateNote(noteId, noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  
  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  
  // Create a note wrapper
  const createNoteWrapper = async (noteData: { title: string; content: string }) => {
    try {
      const result = await createNoteMutation.mutateAsync(noteData);
      return { note: result.note, error: null };
    } catch (error: unknown) {
      return { note: null, error };
    }
  };
  
  // Update a note wrapper
  const updateNoteWrapper = async (
    noteId: string,
    noteData: { title?: string; content?: string }
  ) => {
    try {
      const result = await updateNoteMutation.mutateAsync({ noteId, noteData });
      return { note: result.note, error: null };
    } catch (error: unknown) {
      return { note: null, error };
    }
  };
  
  // Delete a note wrapper
  const deleteNoteWrapper = async (noteId: string) => {
    try {
      await deleteNoteMutation.mutateAsync(noteId);
      return { error: null };
    } catch (error: unknown) {
      return { error };
    }
  };

  return {
    notes,
    isLoading,
    isError,
    refetch,
    getNote,
    createNote: createNoteWrapper,
    isCreating: createNoteMutation.isPending,
    updateNote: updateNoteWrapper,
    isUpdating: updateNoteMutation.isPending,
    deleteNote: deleteNoteWrapper,
    isDeleting: deleteNoteMutation.isPending,
  };
}