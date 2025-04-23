import { Note } from "./supabase";

/**
 * Type definition for action items extracted from notes
 */
export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low' | undefined;
  dueDate?: string;
  category?: string;
  source?: string;
}

/**
 * Type for the summary tabs
 */
export type SummaryTab = 'overview' | 'actions';

/**
 * Type for sort options
 */
export type SortOption = 'default' | 'priority' | 'date';

/**
 * Props for DashboardSummary component
 */
export interface DashboardSummaryProps {
  notes: Note[];
}