'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNoteSummary } from '@/hooks/useSummarization';
import { Loader2, Edit, Trash, MoreVertical, AlignLeft } from 'lucide-react';
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

export function NoteCard({ note, onOpenNote, onDelete }: NoteCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summaryType, setSummaryType] = useState<SummaryType>('brief');
  
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError 
  } = useNoteSummary(note, summaryType);

  const formattedDate = note.updated_at ? 
    format(new Date(note.updated_at), 'MMM d, yyyy h:mm a') : '';
  
  return (
    <Card 
      className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpenNote(note)}
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
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onOpenNote(note)}>
                <Edit className="mr-2 h-4 w-4" /> View & Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Summarize as</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation();
                  setSummaryType('brief'); 
                  setShowSummary(true); 
                }}
              >
                Brief
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation();
                  setSummaryType('actionable'); 
                  setShowSummary(true); 
                }}
              >
                Actionable Items
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation();
                  setSummaryType('todo'); 
                  setShowSummary(true); 
                }}
              >
                To-Do List
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation();
                  setSummaryType('keypoints'); 
                  setShowSummary(true); 
                }}
              >
                Key Points
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-xs">{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        {showSummary ? (
          <div className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                {summaryType} Summary
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSummary(false);
                }}
              >
                View Note
              </Button>
            </div>
            {summaryLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : summaryError ? (
              <p className="text-xs text-destructive">Failed to generate summary</p>
            ) : (
              <div className="text-sm whitespace-pre-line">{summaryData?.summary}</div>
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
          onClick={(e) => {
            e.stopPropagation();
            setShowSummary(!showSummary);
          }}
        >
          <AlignLeft className="h-4 w-4 mr-1" /> 
          {showSummary ? 'Hide Summary' : 'Show Summary'}
        </Button>
      </CardFooter>
    </Card>
  );
}