import { ReactNode } from "react";
import { Note } from "./supabase";

/**
 * Type definition for action items extracted from notes
 */
export interface ActionItem {
  /** Unique identifier for the action item */
  id: string;
  
  /** Text content of the action item */
  text: string;
  
  /** Whether the action item has been completed */
  completed: boolean;
  
  /** Priority level of the action item */
  priority: 'high' | 'medium' | 'low' | undefined;
  
  /** Optional due date for the action item */
  dueDate?: string;
  
  /** Optional category for better organization */
  category?: string;
  
  /** Optional source reference (e.g., note ID) */
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
  /** Array of notes to summarize */
  notes: Note[];
}

/**
 * Props for NoteViewEditDialog component
 */
export interface NoteViewEditDialogProps {
  /** The note to view or edit, null when creating new note */
  note: Note | null;
  
  /** Whether the dialog is currently open */
  isOpen: boolean;
  
  /** Handler for closing the dialog */
  onClose: () => void;
  
  /** Handler for deleting a note */
  onDelete: (id: string) => void;
}

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /**
   * Icon to display at the top of the empty state
   * @default <FileText /> icon
   */
  icon?: ReactNode;
  
  /**
   * Main title text
   */
  title: string;
  
  /**
   * Optional description text
   */
  description?: string;
  
  /**
   * Optional call to action element (typically a button)
   */
  action?: ReactNode;
  
  /**
   * Size variant of the empty state
   * @default "default"
   */
  size?: "compact" | "default" | "large";
  
  /**
   * Whether to apply animation to the empty state
   * @default true
   */
  animate?: boolean;
  
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  
  /**
   * Border style
   * @default "dashed"
   */
  borderStyle?: "dashed" | "solid" | "none";
  
  /**
   * Accessibility role
   * @default "region"
   */
  role?: string;
  
  /**
   * Accessibility label
   */
  "aria-label"?: string;
}