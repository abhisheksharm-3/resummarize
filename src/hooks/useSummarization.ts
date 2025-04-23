'use client';
import { generateInsights, summarizeMultipleNotes, summarizeNote } from '@/services/ai/summarizationService';
import { SummaryQueryOptions, SummaryType } from '@/types/ai';
import { Note } from '@/types/supabase';
import { useQuery} from '@tanstack/react-query';

/**
 * Query keys for AI summarization operations
 */
const summaryKeys = {
  all: ['summaries'] as const,
  note: (noteId: string, type: SummaryType) => 
    [...summaryKeys.all, 'note', noteId, type] as const,
  multipleNotes: (noteIds: string[], type: SummaryType) => 
    [...summaryKeys.all, 'multiple', noteIds.join(','), type] as const,
  insights: (noteIds: string[]) => 
    [...summaryKeys.all, 'insights', noteIds.join(',')] as const,
};

/**
 * Default options for summarization queries
 */
const defaultOptions: SummaryQueryOptions = {
  staleTime: 1000 * 60 * 10, // 10 minutes
  retry: 2,
  retryDelay: 1000,
};

/**
 * Hook for summarizing a single note with AI
 * 
 * @param note - The note to summarize
 * @param type - Summary type (brief, detailed, bullets)
 * @param options - Additional query options
 * @returns Query result containing the summary, loading and error states
 */
export function useNoteSummary(
  note: Note | null, 
  type: SummaryType = 'brief',
  options: SummaryQueryOptions = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };
  
  return useQuery({
    queryKey: note?.id ? summaryKeys.note(note.id, type) : ['invalid'],
    queryFn: async () => {
      if (!note) throw new Error('Note is required for summarization');
      return summarizeNote(note, { type });
    },
    enabled: !!note && (options.enabled !== false),
    staleTime: mergedOptions.staleTime,
    retry: mergedOptions.retry,
    retryDelay: typeof mergedOptions.retryDelay === 'number' 
      ? () => mergedOptions.retryDelay as number
      : undefined,
  });
}

/**
 * Hook for summarizing multiple notes with AI
 * 
 * @param notes - Array of notes to summarize
 * @param type - Summary type (brief, detailed, bullets)
 * @param options - Additional query options
 * @returns Query result containing the combined summary
 */
export function useMultipleNotesSummary(
  notes: Note[], 
  type: SummaryType = 'brief',
  options: SummaryQueryOptions = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };
  const noteIds = notes.map(n => n.id);
  
  return useQuery({
    queryKey: notes.length > 0 ? summaryKeys.multipleNotes(noteIds, type) : ['invalid'],
    queryFn: async () => {
      if (!notes.length) throw new Error('No notes provided for summarization');
      return summarizeMultipleNotes(notes, { type });
    },
    enabled: notes.length > 0 && (options.enabled !== false),
    staleTime: mergedOptions.staleTime,
    retry: mergedOptions.retry,
    retryDelay: typeof mergedOptions.retryDelay === 'number' 
      ? () => mergedOptions.retryDelay as number
      : undefined,
  });
}

/**
 * Hook for generating AI insights from a collection of notes
 * 
 * @param notes - Array of notes to analyze
 * @param options - Additional query options
 * @returns Query result containing generated insights
 */
export function useNotesInsights(
  notes: Note[],
  options: SummaryQueryOptions = {}
) {
  const mergedOptions = { ...defaultOptions, ...options };
  const noteIds = notes.map(n => n.id);
  
  return useQuery({
    queryKey: notes.length > 0 ? summaryKeys.insights(noteIds) : ['invalid'],
    queryFn: async () => {
      if (!notes.length) throw new Error('No notes provided for insights generation');
      return generateInsights(notes);
    },
    enabled: notes.length > 0 && (options.enabled !== false),
    staleTime: mergedOptions.staleTime,
    retry: mergedOptions.retry,
    retryDelay: typeof mergedOptions.retryDelay === 'number' 
      ? () => mergedOptions.retryDelay as number
      : undefined,
    // AI insights are more resource-intensive, so we refetch less often
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}