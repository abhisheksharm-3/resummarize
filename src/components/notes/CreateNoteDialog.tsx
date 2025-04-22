"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useSummarization } from "@/hooks/useSummarization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { debounce } from "lodash";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const contentRef = useRef(content);
  contentRef.current = content;
  
  const { createNote, updateNote } = useNotes();
  const { generateSummary, isGenerating } = useSummarization();
  
  useEffect(() => {
    // Reset form when dialog is opened
    if (open) {
      setTitle("");
      setContent("");
      setSummary("");
      setDraftId(null);
      setError(null);
    }
  }, [open]);
  
  // Create initial draft note when dialog is opened and user starts typing
  const createDraftNote = async () => {
    if (!draftId && title.trim() && content.trim()) {
      try {
        const { note } = await createNote({
          title: title.trim(),
          content: content.trim(),
        });
        
        if (note) {
          setDraftId(note.id);
        }
      } catch (err) {
        console.error("Error creating draft note:", err);
        setError("Failed to save draft. Please try again.");
      }
    }
  };
  
  // Auto-save with debounce
  const saveNoteChanges = useCallback(
    debounce(async () => {
      if (draftId) {
        try {
          setIsAutoSaving(true);
          await updateNote(draftId, {
            title: title.trim(),
            content: contentRef.current.trim(),
          });
          setError(null);
        } catch (err) {
          console.error("Error saving note changes:", err);
          setError("Failed to save changes. Please try again.");
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 1000),
    [draftId, title, updateNote]
  );
  
  // Generate summary when content changes significantly
  const updateSummary = useCallback(
    debounce(async (text: string) => {
      if (text.length > 100) {
        try {
          const newSummary = await generateSummary(text);
          setSummary(newSummary);
        } catch (err) {
          console.error("Error generating summary:", err);
        }
      }
    }, 2000),
    [generateSummary]
  );
  
  useEffect(() => {
    if (title.trim() && content.trim() && !draftId) {
      createDraftNote();
    }
    
    if (draftId && (title.trim() || content.trim())) {
      saveNoteChanges();
    }
    
    if (content.length > 100) {
      updateSummary(content);
    }
  }, [title, content, draftId, saveNoteChanges, updateSummary]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-6">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note. Your changes will be automatically saved as you type.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>
          
          {summary && (
            <div className="rounded-md bg-primary/5 p-3 text-sm relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-primary">
                <Sparkles className="h-3 w-3" />
                <span>AI Summary</span>
              </div>
              <p className="pr-24">{summary}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Textarea
              placeholder="Write your note here..."
              value={content}
              onChange={handleContentChange}
              rows={12}
              className="min-h-[200px] resize-none"
            />
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center">
            {(isAutoSaving || isGenerating) && (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                <span>{isAutoSaving ? "Saving..." : "Generating summary..."}</span>
              </>
            )}
            {!isAutoSaving && !isGenerating && draftId && (
              <span>Changes saved</span>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}