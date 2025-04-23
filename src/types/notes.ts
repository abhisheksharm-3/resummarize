import { Note } from "./supabase";

/**
 * Props for the NoteCard component
 */
export interface NoteCardProps {
  /** The note data to display */
  note: Note;
  
  /** Handler for when a note is opened/selected */
  onOpenNote: (note: Note) => void;
  
  /** Handler for deleting a note */
  onDelete: (id: string) => void;
}

/**
 * Props for the NoteEditor component
 */
export interface NoteEditorProps {
  /** The note to edit, undefined for creating a new note */
  note?: Note;
  
  /** Whether the editor is open */
  isOpen: boolean;
  
  /** Handler for when the editor is closed */
  onClose: () => void;
}

/**
 * Props for the NotesGrid component
 */
export interface NotesGridProps {
  /** Array of notes to display in the grid */
  notes: Note[];
  
  /** Current search term to filter notes */
  searchTerm: string;
  
  /** Handler for when a note is opened/selected */
  onOpenNote: (note: Note) => void;
  
  /** Handler for deleting a note */
  onDeleteNote: (id: string) => void;
}

/**
 * Props for the CreateNoteDialog component
 */
export interface CreateNoteDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  
  /** Handler for when the dialog is closed */
  onClose: () => void;
}

/**
 * Props for the DeleteNoteDialog component
 */
export interface DeleteNoteDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  
  /** Handler for controlling the open state of the dialog */
  onOpenChange: (open: boolean) => void;
  
  /** ID of the note to delete, null when no note is selected */
  noteId: string | null;
  
  /** Optional callback for when a note has been successfully deleted */
  onNoteDeleted?: () => void;
}