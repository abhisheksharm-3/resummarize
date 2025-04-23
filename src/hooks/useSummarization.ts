'use client';

import { summarizationService } from '@/services/ai/summarizationService';
import { SummaryType } from '@/types/ai';
import { Note } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';

// Hook for summarizing a single note
export function useNoteSummary(note: Note | null, type: SummaryType = 'brief') {
  return useQuery({
    queryKey: ['note-summary', note?.id, type],
    queryFn: () => {
      if (!note) throw new Error('Note is required');
      return summarizationService.summarizeNote(note, { type });
    },
    enabled: !!note,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}

// Hook for summarizing multiple notes
export function useMultipleNotesSummary(notes: Note[], type: SummaryType = 'brief') {
  return useQuery({
    queryKey: ['notes-summary', notes.map(n => n.id).join(','), type],
    queryFn: () => {
      if (!notes.length) throw new Error('No notes provided');
      return summarizationService.summarizeMultipleNotes(notes, { type });
    },
    enabled: notes.length > 0,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}

// Hook for generating insights from all notes
export function useNotesInsights(notes: Note[]) {
  return useQuery({
    queryKey: ['notes-insights', notes.map(n => n.id).join(',')],
    queryFn: () => {
      if (!notes.length) throw new Error('No notes provided');
      return summarizationService.generateInsights(notes);
    },
    enabled: notes.length > 0,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}