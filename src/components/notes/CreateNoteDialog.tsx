'use client';

import { useState } from 'react';
import { useCreateNote } from '@/hooks/useNotes';
import { useUser } from '@/hooks/useUser';
import { InsertNote } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateNoteDialogProps } from '@/types/notes';

/**
 * Dialog for creating a new note
 * 
 * @param props - Component props
 * @param props.isOpen - Whether the dialog is open
 * @param props.onClose - Function to close the dialog
 * @returns Create note dialog component
 */
export function CreateNoteDialog({ isOpen, onClose }: CreateNoteDialogProps) {
  const { data: user } = useUser();
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  
  const handleSaveNewNote = () => {
    if (!user || !newNoteTitle.trim()) return;
    
    const newNote: InsertNote = {
      title: newNoteTitle,
      content: newNoteContent,
      user_id: user.id
    };
    
    createNote(newNote, {
      onSuccess: () => {
        onClose();
        setNewNoteTitle('');
        setNewNoteContent('');
      }
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="text-lg font-medium"
            aria-label="Note title"
          />
          <Textarea
            placeholder="Write your note here..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="min-h-[300px]"
            aria-label="Note content"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNewNote} 
            disabled={isCreating || !newNoteTitle.trim()}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Note'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}