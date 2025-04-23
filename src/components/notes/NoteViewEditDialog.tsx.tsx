'use client';

import { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateNote } from '@/hooks/useNotes';
import { Loader2, Edit, AlertTriangle, XCircle, Check, Trash } from 'lucide-react';
import { UpdateNote } from '@/types/supabase';
import { format } from 'date-fns';
import { NoteViewEditDialogProps } from '@/types/dashboard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Dialog for viewing and editing a note
 * 
 * @param props Component props
 * @param props.note The note to view or edit
 * @param props.isOpen Whether the dialog is open
 * @param props.onClose Callback when dialog is closed
 * @param props.onDelete Callback when note is deleted
 * @returns React component
 */
export function NoteViewEditDialog({ note, isOpen, onClose, onDelete }: NoteViewEditDialogProps) {
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Refs for focusing input elements
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Update note mutation hook
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();

  // Reset state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setHasUnsavedChanges(false);
    }
  }, [note]);

  // Focus the title input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isEditing]);

  // Check for unsaved changes
  useEffect(() => {
    if (note) {
      const hasChanges = title !== note.title || content !== note.content;
      setHasUnsavedChanges(hasChanges);
    }
  }, [title, content, note]);

  /**
   * Handle save operation
   */
  const handleSave = useCallback(() => {
    if (!note) return;
    
    const updatedNote: UpdateNote = {
      id: note.id,
      title: title.trim() || 'Untitled Note',
      content,
      user_id: note.user_id
    };

    updateNote(updatedNote, {
      onSuccess: () => {
        setIsEditing(false);
        setHasUnsavedChanges(false);
        onClose();
      }
    });
  }, [note, title, content, updateNote]);

  /**
   * Handle dialog close with unsaved changes check
   */
  const handleClose = useCallback(() => {
    if (isEditing && hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        setIsEditing(false);
        onClose();
      }
    } else {
      setIsEditing(false);
      onClose();
    }
  }, [isEditing, hasUnsavedChanges, onClose]);

  /**
   * Handle delete operation
   */
  const handleDelete = useCallback(() => {
    if (!note) return;
    setShowDeleteConfirm(true);
  }, [note]);

  /**
   * Confirm delete operation
   */
  const confirmDelete = useCallback(() => {
    if (!note) return;
    onDelete(note.id);
    setShowDeleteConfirm(false);
  }, [note, onDelete]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Save on Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (isEditing) {
        handleSave();
      }
    }
    
    // Cancel editing on Escape
    if (e.key === 'Escape' && isEditing) {
      e.preventDefault();
      if (hasUnsavedChanges) {
        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
          setIsEditing(false);
          if (note) {
            setTitle(note.title);
            setContent(note.content);
          }
        }
      } else {
        setIsEditing(false);
      }
    }
  }, [isEditing, hasUnsavedChanges, handleSave, note]);

  // Format the updated date
  const formattedDate = note?.updated_at ? 
    format(new Date(note.updated_at), 'MMM d, yyyy h:mm a') : 'No date available';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="sm:max-w-[700px] max-h-[90vh] overflow-auto"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  ref={titleInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold"
                  placeholder="Note Title"
                  aria-label="Note title"
                />
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 bg-muted border rounded-sm text-xs">Ctrl+S</kbd> to save, <kbd className="px-1 py-0.5 bg-muted border rounded-sm text-xs">Esc</kbd> to cancel
                </p>
              </div>
            ) : (
              <>
                <DialogTitle className="text-xl pr-8 break-words">
                  {title || 'Untitled Note'}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Last updated: {formattedDate}</span>
                </div>
              </>
            )}
          </DialogHeader>
          
          <div className="mt-2">
            {isEditing ? (
              <Textarea
                ref={contentTextareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[350px] text-base"
                placeholder="Write your note here..."
                aria-label="Note content"
              />
            ) : (
              <div className="prose max-w-none whitespace-pre-wrap break-words overflow-auto">
                {content || (
                  <span className="text-muted-foreground italic">This note is empty</span>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 mt-4">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      if (confirm('Discard changes?')) {
                        setIsEditing(false);
                        if (note) {
                          setTitle(note.title);
                          setContent(note.content);
                        }
                      }
                    } else {
                      setIsEditing(false);
                    }
                  }}
                  disabled={isUpdating}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isUpdating || !hasUnsavedChanges}
                  className="min-w-[100px]"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
              <div className="mt-2 p-3 border rounded-md bg-muted/40 text-sm font-medium">
                {title || 'Untitled Note'}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}