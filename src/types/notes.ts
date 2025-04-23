import { Note } from "./supabase";

export interface NoteCardProps {
  note: Note;
  onOpenNote: (note: Note) => void;
  onDelete: (id: string) => void;
}

export interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
}

export interface NotesGridProps {
  notes: Note[];
  searchTerm: string;
  onOpenNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface DeleteNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string | null;
  onNoteDeleted?: () => void;
}