'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '@/controllers/NotesController';
import { InsertNote, UpdateNote } from '@/types/supabase';

export function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => getNoteById(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (note: InsertNote) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (note: UpdateNote) => updateNote(note),
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', updatedNote.id] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
    },
  });
}