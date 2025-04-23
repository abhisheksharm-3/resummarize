'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";;
import { useUser } from '@/hooks/useUser';
import { useCreateNote, useUpdateNote } from '@/hooks/useNotes';
import { Loader2 } from 'lucide-react';
import { NoteEditorProps } from '@/types/notes';
import { InsertNote, UpdateNote } from '@/types/supabase';

export function NoteEditor({ note, isOpen, onClose }: NoteEditorProps) {
  const { data: user } = useUser();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  
  const isLoading = isCreating || isUpdating;

  const handleSave = () => {
    if (!user) return;
    
    if (note) {
      // Update existing note
      const updatedNote: UpdateNote = {
        id: note.id,
        title,
        content,
        user_id: note.user_id
      };
      updateNote(updatedNote, {
        onSuccess: () => {
          onClose();
        }
      });
    } else {
      // Create new note
      const newNote: InsertNote = {
        title,
        content,
        user_id: user.id
      };
      createNote(newNote, {
        onSuccess: () => {
          onClose();
          setTitle('');
          setContent('');
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !title.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {note ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{note ? 'Update' : 'Create'}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}