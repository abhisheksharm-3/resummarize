"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotesController } from "@/controllers/NotesController";
import { useAuth } from "@/hooks/useAuth";

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
    queryFn: () => NotesController.getAllNotes(),
    enabled: !!user, // Only fetch if user is authenticated
  });
  
  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: (noteData: { title: string; content: string }) =>
      NotesController.createNote(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  
  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: (
      [noteId, noteData]: [string, { title?: string; content?: string }]
    ) => NotesController.updateNote(noteId, noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  
  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => NotesController.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  
  // Create a note
  const createNote = async (noteData: { title: string; content: string }) => {
    try {
      const result = await createNoteMutation.mutateAsync(noteData);
      return { note: result.note, error: null };
    } catch (error: any) {
      return { note: null, error };
    }
  };
  
  // Update a note
  const updateNote = async (
    noteId: string,
    noteData: { title?: string; content?: string }
  ) => {
    try {
      const result = await updateNoteMutation.mutateAsync([noteId, noteData]);
      return { note: result.note, error: null };
    } catch (error: any) {
      return { note: null, error };
    }
  };
  
  // Delete a note
  const deleteNote = async (noteId: string) => {
    try {
      await deleteNoteMutation.mutateAsync(noteId);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    notes,
    isLoading,
    isError,
    refetch,
    createNote,
    isCreating: createNoteMutation.isPending,
    updateNote,
    isUpdating: updateNoteMutation.isPending,
    deleteNote,
    isDeleting: deleteNoteMutation.isPending,
  };
}