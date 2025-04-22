"use client";

import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { 
  Edit, 
  MoreVertical, 
  Trash2, 
  Loader2,
  FileEdit,
  Calendar,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { Note } from "@/types/supabase";

interface NotesListProps {
  notes: Note[];
  noteSummaries?: Record<string, string>;
  isLoading: boolean;
  onEditNote: (note: Note) => void;
  onRefetch: () => void;
  onGenerateSummary: (content: string) => Promise<string>;
}

export function NotesList({ 
  notes, 
  noteSummaries = {}, 
  isLoading, 
  onEditNote, 
  onRefetch,
  onGenerateSummary
}: NotesListProps) {
  const { deleteNote, isDeleting } = useNotes();
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [localSummaries, setLocalSummaries] = useState<Record<string, string>>(noteSummaries);
  const [generatingSummaryIds, setGeneratingSummaryIds] = useState<Set<string>>(new Set());
  
  const handleDeleteNote = async () => {
    if (noteToDelete) {
      await deleteNote(noteToDelete.id);
      setNoteToDelete(null);
      onRefetch();
    }
  };
  
  const handleGenerateSummary = async (note: Note) => {
    if (generatingSummaryIds.has(note.id)) return;
    
    setGeneratingSummaryIds(prev => new Set(prev).add(note.id));
    
    try {
      const summary = await onGenerateSummary(note.content);
      setLocalSummaries(prev => ({
        ...prev,
        [note.id]: summary
      }));
    } catch (error) {
      console.error(`Error generating summary for note ${note.id}:`, error);
    } finally {
      setGeneratingSummaryIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(note.id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/40 shadow-sm h-[220px] animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-1/3 bg-muted rounded-md"/>
              <div className="h-3 w-1/2 bg-muted rounded-md"/>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded-md"/>
                <div className="h-3 w-4/5 bg-muted rounded-md"/>
                <div className="h-3 w-5/6 bg-muted rounded-md"/>
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-4 w-2/5 bg-muted rounded-md"/>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileEdit className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No notes yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first note to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
        {notes.map((note) => {
          // Add ellipsis to content if it's too long
          const displayContent = note.content.length > 150 
            ? `${note.content.slice(0, 150)}...` 
            : note.content;
          
          const hasSummary = !!localSummaries[note.id];
          const isGeneratingSummary = generatingSummaryIds.has(note.id);
          
          return (
            <Card 
              key={note.id}
              className="border-border/40 hover:border-border transition-colors group"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => onEditNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      
                      {note.content.length > 100 && !hasSummary && (
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center gap-2"
                          onClick={() => handleGenerateSummary(note)}
                          disabled={isGeneratingSummary}
                        >
                          <Sparkles className="h-4 w-4" />
                          Summarize
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive flex items-center gap-2 focus:text-destructive"
                        onClick={() => setNoteToDelete(note)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {(hasSummary || isGeneratingSummary) && (
                  <div className="mt-2 p-2 bg-primary/5 rounded text-xs">
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <Sparkles className="h-3 w-3" />
                      <span>AI Summary</span>
                    </div>
                    {isGeneratingSummary ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <p className="line-clamp-2">{localSummaries[note.id]}</p>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {displayContent}
                </p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {note.updated_at 
                    ? format(new Date(note.updated_at), "MMM d, yyyy")
                    : "Date unknown"}
                </span>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{noteToDelete?.title}&quot; and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteNote} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}