import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * Header component for the notes section
 * 
 * @param props - Component props
 * @param props.onCreateNote - Handler for creating a new note
 * @returns Notes header component with title and create button
 */
export function NotesHeader({ onCreateNote }: { onCreateNote: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Your Notes</h2>
      <Button onClick={onCreateNote}>
        <Plus className="mr-2 h-4 w-4" /> New Note
      </Button>
    </div>
  );
}