'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateNote } from '@/hooks/useNotes';
import { Loader2, Edit, Save } from 'lucide-react';
import { Note, UpdateNote } from '@/types/supabase';
import { format } from 'date-fns';

interface NoteViewEditDialogProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function NoteViewEditDialog({ note, isOpen, onClose, onDelete }: NoteViewEditDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();

  // Reset state when note changes
  if (note && (note.title !== title || note.content !== content) && !isEditing) {
    setTitle(note.title);
    setContent(note.content);
  }

  const handleSave = () => {
    if (!note) return;
    
    const updatedNote: UpdateNote = {
      id: note.id,
      title,
      content,
      user_id: note.user_id
    };

    updateNote(updatedNote, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const formattedDate = note?.updated_at ? 
    format(new Date(note.updated_at), 'MMM d, yyyy h:mm a') : '';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold"
              placeholder="Note Title"
            />
          ) : (
            <DialogTitle className="text-xl pr-8">{title}</DialogTitle>
          )}
          {!isEditing && (
            <p className="text-sm text-muted-foreground">
              {formattedDate}
            </p>
          )}
        </DialogHeader>
        
        <div className="mt-2">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] text-base"
              placeholder="Write your note here..."
            />
          ) : (
            <div className="prose max-w-none whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => note && onDelete(note.id)}
              >
                Delete
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}