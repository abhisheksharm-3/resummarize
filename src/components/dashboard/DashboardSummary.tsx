'use client';

import { useState } from 'react';
import { useMultipleNotesSummary, useNotesInsights } from '@/hooks/useSummarization';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Note } from '@/types/supabase';
import { Loader2, Sparkles, PlusCircle, CheckSquare, RefreshCw } from 'lucide-react';

interface DashboardSummaryProps {
  notes: Note[];
}

export function DashboardSummary({ notes }: DashboardSummaryProps) {
  // Simplified - only two summary types that users actually need
  const [activeTab, setActiveTab] = useState<'overview' | 'actions'>('overview');
  
  // Get summary data - we use actionable for actions and brief for overview
  const overviewSummary = useMultipleNotesSummary(notes, 'brief');
  const actionableSummary = useMultipleNotesSummary(notes, 'actionable');
  const insights = useNotesInsights(notes);
  
  // Handle refresh based on active tab
  const handleRefresh = () => {
    if (activeTab === 'overview') {
      overviewSummary.refetch();
      insights.refetch();
    } else {
      actionableSummary.refetch();
    }
  };
  
  // Check if there's anything to show
  const hasNotes = notes.length > 0;
  
  // Extract action items more reliably from actionable summary
  const extractActionItems = (summary?: string) => {
    if (!summary) return [];
    
    return summary
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const actionItems = actionableSummary.data?.summary
    ? extractActionItems(actionableSummary.data.summary)
    : [];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> 
          Smart Summary
        </CardTitle>
        
        {hasNotes && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={overviewSummary.isLoading || actionableSummary.isLoading}
            className="h-8 w-8 p-0"
            title="Refresh"
          >
            {overviewSummary.isLoading || actionableSummary.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        {!hasNotes ? (
          <div className="text-center py-8">
            <PlusCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3 opacity-60" />
            <p className="text-muted-foreground">
              Add notes to see your smart summary
            </p>
          </div>
        ) : (
          <>
            <Tabs 
              defaultValue="overview" 
              className="w-full"
              onValueChange={(v) => setActiveTab(v as 'overview' | 'actions')}
              value={activeTab}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                {overviewSummary.isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="prose dark:prose-invert max-w-full text-base">
                      {overviewSummary.data?.summary.split('\n').map((paragraph, i) => (
                        paragraph.trim() ? <p key={i}>{paragraph}</p> : null
                      ))}
                    </div>
                    
                    {/* Key Insights (if available) */}
                    {insights.data?.insights && (
                      <div className="mt-6 pt-5 border-t">
                        <h3 className="text-sm font-medium mb-2 text-muted-foreground uppercase">
                          Key Insights
                        </h3>
                        <div className="prose dark:prose-invert max-w-full text-base">
                          {insights.data.insights
                            .split('\n')
                            .filter(line => line.trim().length > 0)
                            .slice(0, 3) // Limit to top 3 insights
                            .map((insight, i) => (
                              <p key={i}>{insight}</p>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="actions" className="mt-0">
                {actionableSummary.isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                  </div>
                ) : actionItems.length > 0 ? (
                  <div className="space-y-3">
                    {actionItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-accent/20 rounded-md">
                        <CheckSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p>{item.replace(/^[0-9]+\.|\-|\*/, '').trim()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No action items found in your notes
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}