import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, RefreshCw, Plus } from "lucide-react";

interface SummaryCardProps {
  overallSummary: string;
  isRefreshing: boolean;
  isLoading: boolean;
  hasNotes: boolean | undefined;
  onRefresh: () => void;
  onCreateNote: () => void;
}

export function SummaryCard({ 
  overallSummary, 
  isRefreshing, 
  isLoading, 
  hasNotes, 
  onRefresh, 
  onCreateNote 
}: SummaryCardProps) {
  return (
    <Card className="border-border/60 shadow-sm hover:shadow transition-all duration-300">
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
            className="h-8 gap-1 hover:bg-primary/5 transition-colors"
            onClick={onRefresh}
            disabled={isRefreshing || !hasNotes}
          >
            {isRefreshing ? (
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
        {(isRefreshing || isLoading) ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
          </div>
        ) : !hasNotes ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No notes yet. Create your first note to see a summary!
            </p>
            <Button 
              variant="outline" 
              onClick={onCreateNote}
              className="mt-4"
            >
              <Plus size={16} className="mr-2" /> Create Note
            </Button>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p className="leading-relaxed">{overallSummary || "Generate a summary to see insights from your notes."}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}