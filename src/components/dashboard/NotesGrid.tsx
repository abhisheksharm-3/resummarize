import { NoteCard } from '@/components/notes/NoteCard';
import { NotesGridProps } from '@/types/notes';

/**
 * Grid component for displaying notes
 * 
 * @param props - Component props
 * @param props.notes - Array of notes to display
 * @param props.searchTerm - Current search term
 * @param props.onOpenNote - Handler for opening a note
 * @param props.onDeleteNote - Handler for deleting a note
 * @returns Grid of note cards or empty state message
 */
export function NotesGrid({ 
  notes, 
  searchTerm, 
  onOpenNote, 
  onDeleteNote 
}: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        {searchTerm ? 'No notes match your search' : 'No notes yet. Create your first note!'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onOpenNote={onOpenNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
};