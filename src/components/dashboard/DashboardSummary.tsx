'use client';

import { useState, useEffect } from 'react';
import { useMultipleNotesSummary, useNotesInsights } from '@/hooks/useSummarization';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, PlusCircle, RefreshCw, CalendarClock, CircleAlert, BrainCircuit, ListTodo, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ActionItem, DashboardSummaryProps, SortOption, SummaryTab } from '@/types/dashboard';


/**
 * Component that provides AI-generated summaries and action items from user notes
 */
export function DashboardSummary({ notes }: DashboardSummaryProps) {
  // Tabs and states
  const [activeTab, setActiveTab] = useState<SummaryTab>('overview');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [refreshTimestamp, setRefreshTimestamp] = useState<string>("");
  
  // Data fetching hooks
  const overviewSummary = useMultipleNotesSummary(notes, 'brief');
  const actionableSummary = useMultipleNotesSummary(notes, 'actionable');
  const insights = useNotesInsights(notes);
  
  // Debug info
  const currentDateTime = "2025-04-23 13:39:07";
  const currentUser = "abhisheksharm-3";
  
  // Update refresh timestamp when data is refreshed
  useEffect(() => {
    if (!overviewSummary.isLoading && !actionableSummary.isLoading && !isInitialLoad) {
      const now = new Date();
      setRefreshTimestamp(now.toLocaleTimeString());
    }
    
    if ((overviewSummary.data || actionableSummary.data) && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [overviewSummary.data, actionableSummary.data, overviewSummary.isLoading, actionableSummary.isLoading, isInitialLoad]);
  
  // Handle refresh based on active tab
  const handleRefresh = () => {
    if (activeTab === 'overview') {
      overviewSummary.refetch();
      insights.refetch();
    } else {
      actionableSummary.refetch();
    }
    
    // Reset completed items on refresh
    setCompletedItems({});
  };
  
  // Check if there's anything to show
  const hasNotes = notes.length > 0;
  
  /**
   * Extract action items with priority, dates and categories from summary text
   */
  const extractActionItems = (summary?: string): ActionItem[] => {
    if (!summary) return [];
    
    return summary
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        // Remove numbering and leading symbols
        let text = line.replace(/^[0-9]+\.|\-|\*/, '').trim();
        
        // Detect priority with improved patterns
        let priority: 'high' | 'medium' | 'low' | undefined = undefined;
        if (/urgent|asap|immediately|critical|high priority|top priority|crucial|vital/i.test(text)) {
          priority = 'high';
          // Clean up the text
          text = text.replace(/\[(urgent|high|high priority|critical)\]|\(urgent\)|\(high priority\)/i, '').trim();
        } else if (/medium priority|moderate|soon|important but not urgent/i.test(text)) {
          priority = 'medium';
          text = text.replace(/\[(medium|medium priority)\]|\(medium\)|\(medium priority\)/i, '').trim();
        } else if (/low priority|eventually|when possible|minor|not urgent/i.test(text)) {
          priority = 'low';
          text = text.replace(/\[(low|low priority)\]|\(low\)|\(low priority\)/i, '').trim();
        }
        
        // Detect dates with improved pattern matching
        let dueDate: string | undefined = undefined;
        const dateRegex = /(by|on|before|due|until) (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\w\s,]+\d{1,2}(st|nd|rd|th)?(\s*,?\s*\d{4})?|today|tomorrow|next week|this week|(mon|tues|wednes|thurs|fri|satur|sun)day/i;
        const dateMatch = text.match(dateRegex);
        if (dateMatch) {
          dueDate = dateMatch[0];
          // Don't remove date from text as it provides context
        }
        
        // Detect category with improved categorization
        let category: string | undefined = undefined;
        if (/meeting|call|conference|discussion|interview|webinar|presentation/i.test(text)) {
          category = 'Meeting';
        } else if (/email|message|send|write|contact|reply|respond|follow.?up/i.test(text)) {
          category = 'Communication';
        } else if (/review|read|analyze|assess|evaluate|examine/i.test(text)) {
          category = 'Review';
        } else if (/create|develop|build|implement|design|draft|prepare|make/i.test(text)) {
          category = 'Creation';
        } else if (/research|investigate|explore|study|learn/i.test(text)) {
          category = 'Research';
        } else if (/buy|purchase|order|get|acquire/i.test(text)) {
          category = 'Purchase';
        } else if (/schedule|plan|organize|arrange|coordinate/i.test(text)) {
          category = 'Planning';
        }
        
        // Try to identify source document
        let source: string | undefined = undefined;
        const noteMatch = text.match(/from "(.*?)" note/i);
        if (noteMatch && noteMatch[1]) {
          source = noteMatch[1];
        }
        
        return {
          id: `action-${index}`,
          text,
          completed: completedItems[`action-${index}`] || false,
          priority,
          dueDate,
          category,
          source
        };
      });
  };

  // Extract and process action items
  const actionItems = actionableSummary.data?.summary
    ? extractActionItems(actionableSummary.data.summary)
    : [];
    
  // Sort action items based on current sort preference
  const sortedActionItems = [...actionItems].sort((a, b) => {
    // Always put completed items at the bottom regardless of sort
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then apply the selected sort
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
      return (priorityOrder[a.priority || 'undefined'] - priorityOrder[b.priority || 'undefined']);
    } else if (sortBy === 'date') {
      // If both have due dates, compare them
      if (a.dueDate && b.dueDate) {
        // Simple string comparison - works for many date formats
        return a.dueDate.localeCompare(b.dueDate);
      }
      // Items with due dates come before those without
      return a.dueDate ? -1 : (b.dueDate ? 1 : 0);
    }
    
    // Default sort - preserved from original array
    return 0;
  });
  
  /**
   * Toggle the completed state of an action item
   */
  const toggleComplete = (id: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  /**
   * Get the CSS class for priority badges based on priority level
   */
  const getPriorityColor = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'low': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  // Check if there are any errors to display
  const hasError = overviewSummary.error || actionableSummary.error || insights.error;
  const errorMessage = overviewSummary.error?.message || actionableSummary.error?.message || insights.error?.message;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> 
            Smart Summary
          </CardTitle>
          {notes.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {hasNotes && (
          <div className="flex items-center gap-2">
            {refreshTimestamp && (
              <span className="text-xs text-muted-foreground hidden md:inline-block">
                Last updated: {refreshTimestamp}
              </span>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={overviewSummary.isLoading || actionableSummary.isLoading || insights.isLoading}
                    className="h-8 w-8 p-0"
                    aria-label="Refresh summary"
                  >
                    {overviewSummary.isLoading || actionableSummary.isLoading || insights.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh summary</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Error state */}
        {hasError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {errorMessage || "There was an error generating your summary. Please try again."}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Empty state */}
        {!hasNotes ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-60" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Add some notes to see AI-powered summaries and action items extracted from your content.
            </p>
          </motion.div>
        ) : (
          <>
            <Tabs 
              defaultValue="overview" 
              className="w-full"
              onValueChange={(v) => setActiveTab(v as SummaryTab)}
              value={activeTab}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-1.5">
                  <BrainCircuit className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4" /> 
                  <span>Action Items</span>
                  {actionItems.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                      {actionItems.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-0 focus:outline-none">
                {overviewSummary.isLoading ? (
                  <OverviewSkeletonLoader />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key="overview-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Unified Summary */}
                      <div className="prose dark:prose-invert max-w-full">
                        {overviewSummary.data?.summary.split('\n').map((paragraph, i) => (
                          paragraph.trim() ? (
                            <motion.p 
                              key={i}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {paragraph}
                            </motion.p>
                          ) : null
                        ))}
                      </div>
                      
                      {/* Key Insights */}
                      {insights.data?.insights && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="pt-4 border-t"
                        >
                          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
                            <Sparkles className="h-3.5 w-3.5" /> Key Insights
                          </h3>
                          <div className="prose dark:prose-invert max-w-full">
                            {insights.data.insights
                              .split('\n')
                              .filter(line => line.trim().length > 0)
                              .map((insight, i) => (
                                <motion.p 
                                  key={i}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + (i * 0.1) }}
                                >
                                  {insight}
                                </motion.p>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </TabsContent>
              
              {/* ACTION ITEMS TAB */}
              <TabsContent value="actions" className="mt-0 focus:outline-none">
                {actionableSummary.isLoading ? (
                  <ActionItemsSkeletonLoader />
                ) : sortedActionItems.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="action-items-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                        <h3 className="text-sm font-medium">
                          {actionItems.length} Action Item{actionItems.length !== 1 ? 's' : ''}
                        </h3>
                        
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground mr-2">Sort by:</span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="text-xs bg-muted/30 border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            aria-label="Sort action items"
                          >
                            <option value="default">Default</option>
                            <option value="priority">Priority</option>
                            <option value="date">Due Date</option>
                          </select>
                        </div>
                      </div>
                      
                      <ScrollArea className="max-h-[460px] pr-4 -mr-4">
                        <motion.div 
                          className="space-y-2.5"
                          layout
                        >
                          {sortedActionItems.map((item, index) => (
                            <motion.div
                              layout
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
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
                                aria-label={`Mark "${item.text.substring(0, 20)}..." as ${item.completed ? 'incomplete' : 'complete'}`}
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
                                {(item.priority || item.dueDate || item.category || item.source) && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
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
                                    
                                    {item.source && (
                                      <Badge variant="secondary" className="text-xs font-normal">
                                        From: {item.source}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </ScrollArea>
                      
                      {Object.values(completedItems).some(Boolean) && (
                        <div className="text-xs text-muted-foreground text-center mt-4 py-2 border-t">
                          Completed items will be reset when you refresh the summary
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <ListTodo className="mx-auto h-10 w-10 text-muted-foreground mb-3 opacity-60" />
                    <p className="text-muted-foreground">
                      No action items found in your notes
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Try adding tasks or to-dos in your notes
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      {/* Hidden debug info */}
      <div className="text-[8px] text-muted-foreground/30 hidden">
        {currentDateTime} - {currentUser}
      </div>
    </Card>
  );
}

/**
 * Skeleton loader for the overview tab
 */
function OverviewSkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
        <Skeleton className="h-5 w-4/5" />
      </div>
      
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for the action items tab
 */
function ActionItemsSkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-32" />
      </div>
      
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 border border-border/50 p-3 rounded-md">
          <Skeleton className="h-4 w-4 mt-1 rounded-sm" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-5 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}