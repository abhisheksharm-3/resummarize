'use client';

import { useDeleteNote } from '@/hooks/useNotes';
import { Loader2, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { DeleteNoteDialogProps } from '@/types/notes';

/**
 * Dialog for confirming note deletion
 * 
 * @param props - Component props
 * @param props.isOpen - Whether the dialog is open
 * @param props.onOpenChange - Function to update dialog open state
 * @param props.noteId - ID of the note to delete
 * @param props.onNoteDeleted - Optional callback for when note is deleted
 * @returns Delete confirmation dialog component
 */
export function DeleteNoteDialog({ 
  isOpen, 
  onOpenChange, 
  noteId,
  onNoteDeleted
}: DeleteNoteDialogProps) {
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();
  
  const confirmDeleteNote = () => {
    if (!noteId) return;
    
    deleteNote(noteId, {
      onSuccess: () => {
        onOpenChange(false);
        onNoteDeleted?.();
      }
    });
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this note. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDeleteNote} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}