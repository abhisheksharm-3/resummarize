import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

/**
 * Search bar for filtering notes
 * 
 * @param props - Component props
 * @param props.searchTerm - Current search term
 * @param props.setSearchTerm - Function to update search term
 * @returns Search bar component
 */
export function NotesSearchBar({ 
  searchTerm, 
  setSearchTerm 
}: { 
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
        aria-label="Search notes"
      />
    </div>
  );
}