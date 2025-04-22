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
import { Note } from "@/types/supabase";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
}

export function EditNoteDialog({ open, onOpenChange, note }: EditNoteDialogProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [summary, setSummary] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const contentRef = useRef(content);
  contentRef.current = content;
  
  const { updateNote } = useNotes();
  const { generateSummary, isGenerating } = useSummarization();
  
  useEffect(() => {
    if (open) {
      setTitle(note.title);
      setContent(note.content);
      setError(null);
      
      // Generate summary when opening the dialog if content is long enough
      if (note.content.length > 100) {
        generateSummary(note.content).then(setSummary);
      }
    }
  }, [open, note, generateSummary]);
  
  // Auto-save with debounce
  const saveNoteChanges = useCallback(
    debounce(async () => {
      try {
        setIsAutoSaving(true);
        await updateNote(note.id, {
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
    }, 1000),
    [title, note.id, updateNote]
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
    // Only save if there have been actual changes
    if (title !== note.title || contentRef.current !== note.content) {
      saveNoteChanges();
    }
    
    // Only update summary if content changed significantly
    if (contentRef.current !== note.content && content.length > 100) {
      updateSummary(content);
    }
  }, [title, content, note, saveNoteChanges, updateSummary]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-6">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Make changes to your note. Updates are automatically saved as you type.
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
            {!isAutoSaving && !isGenerating && (
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