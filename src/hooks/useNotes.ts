'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '@/controllers/NotesController';
import { InsertNote, UpdateNote, Note } from '@/types/supabase';

/**
 * Query keys for notes operations to ensure consistency
 */
const noteKeys = {
  all: ['notes'] as const,
  detail: (id: string) => [...noteKeys.all, id] as const,
};

/**
 * Hook to fetch all notes
 * @returns Query result containing notes data, loading and error states
 */
export function useNotes() {
  return useQuery({
    queryKey: noteKeys.all,
    queryFn: getNotes,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time for better performance
  });
}

/**
 * Hook to fetch a single note by ID
 * @param id - The unique identifier of the note
 * @returns Query result containing note data, loading and error states
 */
export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => getNoteById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });
}

/**
 * Custom hook that provides all note mutation operations
 * using a single query client instance
 * @returns Object containing all note mutation operations
 */
export function useNoteMutations() {
  const queryClient = useQueryClient();
  
  /**
   * Create a new note with optimistic updates
   */
  const createNoteMutation = useMutation({
    mutationFn: (note: InsertNote) => createNote(note),
    onMutate: async (newNote) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: noteKeys.all });
      
      // Snapshot the previous value
      const previousNotes = queryClient.getQueryData<Note[]>(noteKeys.all);
      
      // Optimistically update the cache
      if (previousNotes) {
        queryClient.setQueryData<Note[]>(noteKeys.all, [
          ...previousNotes,
          { ...newNote, id: 'temp-id-' + Date.now() } as Note
        ]);
      }
      
      return { previousNotes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
    onError: (_, __, context) => {
      // On error, roll back to the previous value
      if (context?.previousNotes) {
        queryClient.setQueryData(noteKeys.all, context.previousNotes);
      }
    }
  });

  /**
   * Update an existing note with optimistic updates
   */
  const updateNoteMutation = useMutation({
    mutationFn: (note: UpdateNote & { id: string }) => updateNote(note),
    onMutate: async (updatedNote) => {
      // Ensure id exists before proceeding
      if (!updatedNote.id) {
        throw new Error("Cannot update note without an ID");
      }
      
      await queryClient.cancelQueries({ 
        queryKey: noteKeys.detail(updatedNote.id) 
      });
      
      const previousNote = queryClient.getQueryData<Note>(
        noteKeys.detail(updatedNote.id)
      );
      
      // Optimistically update the detail view
      queryClient.setQueryData<Note>(
        noteKeys.detail(updatedNote.id),
        old => ({ ...old, ...updatedNote } as Note)
      );
      
      // Also update in the list view if present
      const previousNotes = queryClient.getQueryData<Note[]>(noteKeys.all);
      if (previousNotes) {
        queryClient.setQueryData<Note[]>(
          noteKeys.all,
          previousNotes.map(note => 
            note.id === updatedNote.id 
              ? { ...note, ...updatedNote } 
              : note
          )
        );
      }
      
      return { previousNote, previousNotes };
    },
    onSuccess: (updatedNote) => {
      if (updatedNote.id) {
        queryClient.invalidateQueries({ 
          queryKey: noteKeys.detail(updatedNote.id) 
        });
      }
      queryClient.invalidateQueries({ 
        queryKey: noteKeys.all 
      });
    },
    onError: (_, updatedNote, context) => {
      // Revert optimistic updates on error
      if (context?.previousNote && updatedNote.id) {
        queryClient.setQueryData(
          noteKeys.detail(updatedNote.id),
          context.previousNote
        );
      }
      
      if (context?.previousNotes) {
        queryClient.setQueryData(noteKeys.all, context.previousNotes);
      }
    }
  });

  /**
   * Delete a note with optimistic updates
   */
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.all });
      await queryClient.cancelQueries({ queryKey: noteKeys.detail(id) });
      
      // Snapshot the previous values
      const previousNotes = queryClient.getQueryData<Note[]>(noteKeys.all);
      
      // Optimistically remove from the list
      if (previousNotes) {
        queryClient.setQueryData<Note[]>(
          noteKeys.all,
          previousNotes.filter(note => note.id !== id)
        );
      }
      
      return { previousNotes };
    },
    onSuccess: (_, id) => {
      // Remove from cache completely
      queryClient.removeQueries({ queryKey: noteKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
    onError: (_, id, context) => {
      // Restore previous data on error
      if (context?.previousNotes) {
        queryClient.setQueryData(noteKeys.all, context.previousNotes);
      }
    }
  });
  
  return {
    createNote: createNoteMutation,
    updateNote: updateNoteMutation,
    deleteNote: deleteNoteMutation
  };
}

// For backward compatibility
export function useCreateNote() {
  const { createNote } = useNoteMutations();
  return createNote;
}

export function useUpdateNote() {
  const { updateNote } = useNoteMutations();
  return updateNote;
}

export function useDeleteNote() {
  const { deleteNote } = useNoteMutations();
  return deleteNote;
}