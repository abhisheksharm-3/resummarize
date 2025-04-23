import { Note } from "./supabase";

export interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
}