'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNoteSummary } from '@/hooks/useSummarization';
import { Edit, Trash, MoreVertical, AlignLeft, FileText, AlertCircle, List, CheckSquare, FileBarChart2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { SummaryType } from '@/types/ai';
import { NoteCardProps } from '@/types/notes';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

/**
 * Maps summary types to their display titles and icons
 */
const SUMMARY_TYPES: Record<SummaryType, { title: string; icon: React.ReactNode }> = {
  'brief': { 
    title: 'Brief Summary', 
    icon: <FileText className="h-4 w-4" /> 
  },
  'actionable': { 
    title: 'Actionable Items', 
    icon: <List className="h-4 w-4" /> 
  },
  'todo': { 
    title: 'To-Do List', 
    icon: <CheckSquare className="h-4 w-4" /> 
  },
  'keypoints': { 
    title: 'Key Points', 
    icon: <FileBarChart2 className="h-4 w-4" /> 
  },
};

/**
 * NoteCard component displays an individual note with title, content, and options to view AI-generated summaries
 * 
 * @param props Component props
 * @param props.note The note data to display
 * @param props.onOpenNote Callback when note is opened
 * @param props.onDelete Callback when note is deleted
 * @returns React component
 */
export function NoteCard({ note, onOpenNote, onDelete }: NoteCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summaryType, setSummaryType] = useState<SummaryType>('brief');
  
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError,
    refetch: refreshSummary
  } = useNoteSummary(note, summaryType);
  
  // Format the date for display
  const formattedDate = note.updated_at ? 
    format(new Date(note.updated_at), 'MMM d, yyyy h:mm a') : 'No date';
  
  // Debug information - hidden in UI
  const currentDateTime = "2025-04-23 13:47:24";
  const currentUser = "abhisheksharm-3";

  /**
   * Handles showing a specific summary type
   */
  const handleShowSummary = useCallback((type: SummaryType, event: React.MouseEvent) => {
    event.stopPropagation();
    setSummaryType(type);
    setShowSummary(true);
  }, []);

  /**
   * Toggles summary visibility
   */
  const toggleSummary = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowSummary(prev => !prev);
  }, []);

  /**
   * Handles note deletion with confirmation
   */
  const handleDelete = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  }, [note.id, onDelete]);

  /**
   * Directly open the note for editing
   */
  const handleOpenNote = useCallback((event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    onOpenNote(note);
  }, [note, onOpenNote]);

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer border-border/60"
      onClick={handleOpenNote}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()} // Prevent dialog open when clicking dropdown
                aria-label="Note options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              onClick={(e) => e.stopPropagation()}
              className="w-56"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleOpenNote}
                className="cursor-pointer flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" /> View & Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Summarize as</DropdownMenuLabel>
              {(Object.keys(SUMMARY_TYPES) as SummaryType[]).map((type) => (
                <DropdownMenuItem 
                  key={type}
                  onClick={(e) => handleShowSummary(type, e)}
                  className="cursor-pointer flex items-center"
                >
                  {SUMMARY_TYPES[type].icon} 
                  <span className="ml-2">{SUMMARY_TYPES[type].title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-xs flex items-center gap-1">
          {formattedDate}
          {note.content.length > 1000 && (
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm ml-1">Long</span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        {showSummary ? (
          <div className="text-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
                {SUMMARY_TYPES[summaryType].icon}
                <span className="uppercase">{summaryType}</span> Summary
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSummary(false);
                }}
                aria-label="View original note content"
              >
                View Note
              </Button>
            </div>
            
            {summaryLoading ? (
              <SummarySkeleton />
            ) : summaryError ? (
              <SummaryError onRetry={(e) => {
                e.stopPropagation();
                refreshSummary();
              }} />
            ) : (
              <div className="text-sm space-y-1 whitespace-pre-line">
                {summaryData?.summary.split('\n').map((paragraph, i) => (
                  paragraph.trim() ? (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>{paragraph}</p>
                  ) : null
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="line-clamp-4 text-sm">{note.content}</div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto"
          onClick={toggleSummary}
          aria-label={showSummary ? "Hide summary" : "Show summary"}
        >
          <AlignLeft className="h-4 w-4 mr-1" /> 
          {showSummary ? 'Hide Summary' : 'Show Summary'}
        </Button>
      </CardFooter>
      
      {/* Debug info - hidden */}
      <div className="hidden text-[8px] text-muted-foreground/30">
        {currentDateTime} - {currentUser}
      </div>
    </Card>
  );
}

/**
 * Loading skeleton for summary content
 */
function SummarySkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === 2 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/**
 * Error state for failed summary generation
 */
function SummaryError({ onRetry }: { onRetry: (e: React.MouseEvent) => void }) {
  return (
    <div className="p-3 rounded-md bg-destructive/10 text-destructive flex flex-col items-center text-center">
      <AlertCircle className="h-5 w-5 mb-1" />
      <p className="text-xs">Failed to generate summary</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry} 
        className="mt-2 h-7 text-xs border-destructive/20"
      >
        Try Again
      </Button>
    </div>
  );
}