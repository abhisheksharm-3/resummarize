"use client";

import { useState, useCallback, useMemo } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useSummarization } from "@/hooks/useSummarization";
import { Note } from "@/types/supabase";

// Layout Components
import { Navbar } from "@/components/layout/Navbar";
import { Dialog } from "@/components/ui/dialog";

// UI Components
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2 } from "lucide-react";

// Feature Components
import { NotesList } from "@/components/notes/NotesList";
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { SummaryCard } from "@/components/notes/SummaryCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyNotesState } from "@/components/notes/EmptyNotesState";

export default function Dashboard() {
  const { 
    notes, 
    isLoading: isNotesLoading, 
    refetch: refetchNotes 
  } = useNotes();
  
  const { 
    generateSummary, 
    generateBulkSummary, 
    isGenerating: isSummarizationGenerating 
  } = useSummarization();
  
  // State management
  const [noteSummaries, setNoteSummaries] = useState<Record<string, string>>({});
  const [overallSummary, setOverallSummary] = useState<string>("");
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Memoized values
  const hasNotes = useMemo(() => notes && notes.length > 0, [notes]);
  
  // Generate summary for all notes
  const generateOverallSummary = useCallback(async () => {
    if (!hasNotes) return;
    
    setIsRefreshingSummary(true);
    try {
      const content = notes?.map(note => note.content).join("\n\n") || "";
      const summary = await generateBulkSummary(content);
      setOverallSummary(summary);
    } catch (error) {
      console.error("Error generating overall summary:", error);
    } finally {
      setIsRefreshingSummary(false);
    }
  }, [notes, generateBulkSummary, hasNotes]);

  // Event handlers - using callbacks to prevent unnecessary re-renders
  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditingNote(null);
    refetchNotes();
  }, [refetchNotes]);

  const handleCloseCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
    refetchNotes();
  }, [refetchNotes]);

  const handleRefresh = useCallback(() => {
    refetchNotes();
    generateOverallSummary();
  }, [refetchNotes, generateOverallSummary]);

  const handleCreateNote = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  // Note summaries management
  const handleGenerateSingleSummary = useCallback(async (noteId: string, content: string) => {
    try {
      const summary = await generateSummary(content);
      setNoteSummaries(prev => ({
        ...prev,
        [noteId]: summary
      }));
      return summary;
    } catch (error) {
      console.error("Error generating note summary:", error);
      return "";
    }
  }, [generateSummary]);

  return (
    <Dialog>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-8">
            {/* Dashboard Header */}
            <DashboardHeader onCreateNote={handleCreateNote} />
            
            {/* Summary Card */}
            <SummaryCard
              overallSummary={overallSummary}
              isRefreshing={isRefreshingSummary}
              isLoading={isNotesLoading}
              hasNotes={hasNotes}
              onRefresh={generateOverallSummary}
              onCreateNote={handleCreateNote}
            />
            
            {/* Notes List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Notes</h2>
                <Button
                  variant="ghost" 
                  size="sm"
                  className="text-primary flex items-center gap-1 hover:bg-primary/5 transition-colors"
                  onClick={handleRefresh}
                  disabled={isNotesLoading}
                >
                  {isNotesLoading ? (
                    <Loader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    <>
                      Refresh
                      <ArrowUpRight size={16} />
                    </>
                  )}
                </Button>
              </div>
              
              {isNotesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                </div>
              ) : !hasNotes ? (
                <EmptyNotesState onCreateNote={handleCreateNote} />
              ) : (
                <div className="grid gap-4 animate-in fade-in duration-300">
                  <NotesList 
                    notes={notes || []} 
                    noteSummaries={noteSummaries}
                    onEditNote={handleEditNote}
                    onRefetch={refetchNotes}
                    onGenerateSummary={handleGenerateSingleSummary}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* Dialogs */}
        <CreateNoteDialog 
          open={isCreateDialogOpen} 
          onOpenChange={handleCloseCreateDialog} 
        />
        
        {editingNote && (
          <EditNoteDialog 
            open={!!editingNote} 
            onOpenChange={handleCloseEditDialog} 
            note={editingNote}
          />
        )}
      </div>
    </Dialog>
  );
}