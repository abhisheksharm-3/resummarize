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