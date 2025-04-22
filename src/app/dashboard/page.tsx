"use client";

import { useState, useEffect, useCallback } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useSummarization } from "@/hooks/useSummarization";
import { Navbar } from "@/components/layout/Navbar";
import { NotesList } from "@/components/notes/NotesList";
import { CreateNoteDialog } from "@/components/notes/CreateNoteDialog";
import { EditNoteDialog } from "@/components/notes/EditNoteDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, ArrowUpRight, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/supabase";
import { Dialog } from "@/components/ui/dialog";

export default function Dashboard() {
  const { user } = useAuth();
  const { notes, isLoading: isNotesLoading, refetch: refetchNotes } = useNotes();
  const { generateSummary, generateBulkSummary, isGenerating: isSummarizationGenerating } = useSummarization();
  
  const [noteSummaries, setNoteSummaries] = useState<Record<string, string>>({});
  const [overallSummary, setOverallSummary] = useState<string>("");
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Generate summary for all notes whenever notes change
  const generateOverallSummary = useCallback(async () => {
    if (!notes || notes.length === 0) return;
    
    setIsRefreshingSummary(true);
    try {
      const content = notes.map(note => note.content).join("\n\n");
      const summary = await generateBulkSummary(content);
      setOverallSummary(summary);
    } catch (error) {
      console.error("Error generating overall summary:", error);
    } finally {
      setIsRefreshingSummary(false);
    }
  }, [notes, generateBulkSummary]);

  useEffect(() => {
    if (notes && notes.length > 0) {
      generateOverallSummary();
    }
  }, [notes, generateOverallSummary]);

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleCloseEditDialog = () => {
    setEditingNote(null);
    refetchNotes();
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    refetchNotes();
  };

  const handleRefresh = () => {
    refetchNotes();
    generateOverallSummary();
  };

  return (
    <Dialog>
      <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize your notes
              </p>
            </div>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Create Note
            </Button>
          </div>
          
          {/* Summary Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    Summary Overview
                  </CardTitle>
                  <CardDescription>
                    AI-generated summary of all your notes
                  </CardDescription>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={generateOverallSummary}
                  disabled={isRefreshingSummary || !notes || notes.length === 0}
                >
                  {isRefreshingSummary ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Refreshing</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      <span>Refresh</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(isRefreshingSummary || isNotesLoading) ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : notes && notes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No notes yet. Create your first note to see a summary!
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="mt-4"
                  >
                    <Plus size={16} className="mr-2" /> Create Note
                  </Button>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <p>{overallSummary || "Generate a summary to see insights from your notes."}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Notes List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Notes</h2>
              <Button
                variant="ghost" 
                size="sm"
                className="text-primary flex items-center gap-1"
                onClick={handleRefresh}
              >
                Refresh
                <ArrowUpRight size={16} />
              </Button>
            </div>
            
            <NotesList 
              notes={notes || []} 
              noteSummaries={noteSummaries}
              isLoading={isNotesLoading} 
              onEditNote={handleEditNote}
              onRefetch={refetchNotes}
              onGenerateSummary={generateSummary}
            />
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