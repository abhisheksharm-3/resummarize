import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyNotesStateProps {
  onCreateNote: () => void;
}

export function EmptyNotesState({ onCreateNote }: EmptyNotesStateProps) {
  return (
    <div className="bg-muted/30 border border-border/60 rounded-lg flex flex-col items-center justify-center py-16 text-center">
      <div className="max-w-md space-y-4">
        <h3 className="text-lg font-medium">No notes yet</h3>
        <p className="text-muted-foreground">
          Create your first note to start organizing your thoughts and ideas.
        </p>
        <Button 
          onClick={onCreateNote}
          className="mt-2"
        >
          <Plus size={16} className="mr-2" /> Create Your First Note
        </Button>
      </div>
    </div>
  );
}