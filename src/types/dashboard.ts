import { ReactNode } from "react";
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
export interface NoteViewEditDialogProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
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