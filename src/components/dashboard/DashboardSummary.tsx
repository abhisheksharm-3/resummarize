'use client';

import { useState } from 'react';
import { useMultipleNotesSummary, useNotesInsights } from '@/hooks/useSummarization';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Note } from '@/types/supabase';
import { Loader2, Sparkles, PlusCircle, RefreshCw, CalendarClock, CircleAlert, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSummaryProps {
  notes: Note[];
}

interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low' | undefined;
  dueDate?: string;
  category?: string;
}

export function DashboardSummary({ notes }: DashboardSummaryProps) {
  // Simplified - only two summary types that users actually need
  const [activeTab, setActiveTab] = useState<'overview' | 'actions'>('overview');
  const [sortBy, setSortBy] = useState<'default' | 'priority'>('default');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  
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
  
  // Extract action items with priority and dates
  const extractActionItems = (summary?: string): ActionItem[] => {
    if (!summary) return [];
    
    return summary
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        // Remove numbering and leading symbols
        let text = line.replace(/^[0-9]+\.|\-|\*/, '').trim();
        
        // Detect priority
        let priority: 'high' | 'medium' | 'low' | undefined = undefined;
        if (/urgent|asap|immediately|critical|high priority/i.test(text)) {
          priority = 'high';
          // Clean up the text by removing priority indicators
          text = text.replace(/\[(urgent|high|high priority)\]/i, '').trim();
        } else if (/medium priority|soon/i.test(text)) {
          priority = 'medium';
          text = text.replace(/\[(medium|medium priority)\]/i, '').trim();
        } else if (/low priority|eventually|when possible/i.test(text)) {
          priority = 'low';
          text = text.replace(/\[(low|low priority)\]/i, '').trim();
        }
        
        // Detect dates
        let dueDate: string | undefined = undefined;
        const dateRegex = /(by|on|before|due) (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\w\s,]+\d{1,2}(st|nd|rd|th)?(\s*,?\s*\d{4})?|today|tomorrow|next week|this week|(mon|tues|wednes|thurs|fri|satur|sun)day/i;
        const dateMatch = text.match(dateRegex);
        if (dateMatch) {
          dueDate = dateMatch[0];
        }
        
        // Detect category
        let category: string | undefined = undefined;
        if (/meeting|call|conference|discussion/i.test(text)) {
          category = 'Meeting';
        } else if (/email|message|send|write/i.test(text)) {
          category = 'Communication';
        } else if (/review|read|analyze/i.test(text)) {
          category = 'Review';
        } else if (/create|develop|build|implement/i.test(text)) {
          category = 'Creation';
        } else if (/research|investigate|explore/i.test(text)) {
          category = 'Research';
        }
        
        return {
          id: `action-${index}`,
          text,
          completed: completedItems[`action-${index}`] || false,
          priority,
          dueDate,
          category
        };
      });
  };

  const actionItems = actionableSummary.data?.summary
    ? extractActionItems(actionableSummary.data.summary)
    : [];
    
  // Sort action items
  const sortedActionItems = [...actionItems].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
      return (priorityOrder[a.priority || 'undefined'] - priorityOrder[b.priority || 'undefined']);
    }
    
    // Default sort - completed items at bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    return 0;
  });
  
  const toggleComplete = (id: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const getPriorityColor = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'low': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

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
                ) : sortedActionItems.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium">
                        {actionItems.length} Action Item{actionItems.length !== 1 ? 's' : ''}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs flex items-center gap-1"
                        onClick={() => setSortBy(sortBy === 'default' ? 'priority' : 'default')}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        Sort by {sortBy === 'default' ? 'Default' : 'Priority'}
                      </Button>
                    </div>
                    
                    <div className="space-y-2.5">
                      {sortedActionItems.map((item) => (
                        <div 
                          key={item.id}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-md border transition-colors",
                            item.completed 
                              ? "bg-muted/40 border-muted" 
                              : "bg-card border-border hover:border-primary/30"
                          )}
                        >
                          <Checkbox 
                            id={item.id}
                            checked={item.completed}
                            onCheckedChange={() => toggleComplete(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label 
                              htmlFor={item.id} 
                              className={cn(
                                "block text-sm font-medium cursor-pointer",
                                item.completed && "line-through text-muted-foreground"
                              )}
                            >
                              {item.text}
                            </label>
                            
                            {/* Metadata row - priorities, dates, etc */}
                            {(item.priority || item.dueDate || item.category) && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {item.priority && (
                                  <div className={cn(
                                    "inline-flex items-center text-xs px-2 py-0.5 rounded-full",
                                    getPriorityColor(item.priority)
                                  )}>
                                    <CircleAlert className="h-3 w-3 mr-1" />
                                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} priority
                                  </div>
                                )}
                                
                                {item.dueDate && (
                                  <div className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                    <CalendarClock className="h-3 w-3 mr-1" />
                                    {item.dueDate}
                                  </div>
                                )}
                                
                                {item.category && (
                                  <Badge variant="outline" className="text-xs font-normal">
                                    {item.category}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Completed items indicator */}
                    {Object.values(completedItems).some(Boolean) && (
                      <div className="text-xs text-muted-foreground text-center mt-3">
                        Completed items will reset when you refresh the summary
                      </div>
                    )}
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