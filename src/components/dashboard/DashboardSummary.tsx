'use client';

import { useDynamicSummaries } from '@/hooks/useSummarization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { SummaryType } from '@/types/ai';
import { Note } from '@/types/supabase';
import { Loader2, RefreshCw } from 'lucide-react';

interface DashboardSummaryProps {
  notes: Note[];
}

export function DashboardSummary({ notes }: DashboardSummaryProps) {
  const {
    selectedSummaryType,
    setSelectedSummaryType,
    summaryTypes,
    allNotesSummary,
    notesInsights,
    isLoading
  } = useDynamicSummaries(notes);

  const handleRefresh = () => {
    allNotesSummary.refetch();
    notesInsights.refetch();
  };

  // Format the summary type for display
  const formatSummaryType = (type: SummaryType): string => {
    switch (type) {
      case 'brief': return 'Brief';
      case 'detailed': return 'Detailed';
      case 'actionable': return 'Actionable';
      case 'todo': return 'To-Do';
      case 'keypoints': return 'Key Points';
      default: return type;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">AI Powered Insights</CardTitle>
          <CardDescription>AI-generated summaries and insights from your notes</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Add some notes to see AI-generated insights
          </div>
        ) : (
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {summaryTypes.map((type) => (
                    <Button 
                      key={type}
                      variant={selectedSummaryType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSummaryType(type)}
                    >
                      {formatSummaryType(type)}
                    </Button>
                  ))}
                </div>
                
                {allNotesSummary.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : allNotesSummary.error ? (
                  <div className="py-8 text-center text-destructive">
                    Failed to generate summary
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-full whitespace-pre-line">
                    {allNotesSummary.data?.summary}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              {notesInsights.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : notesInsights.error ? (
                <div className="py-8 text-center text-destructive">
                  Failed to generate insights
                </div>
              ) : (
                <div className="prose prose-sm max-w-full whitespace-pre-line">
                  {notesInsights.data?.insights}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="actions">
              <div className="space-y-4">
                {/* Automatically show the actionable items summary */}
                {allNotesSummary.isLoading || selectedSummaryType !== 'actionable' ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-full">
                    {allNotesSummary.data?.summary}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}