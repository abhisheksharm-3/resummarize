import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onCreateNote: () => void;
}

export function DashboardHeader({ onCreateNote }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage and organize your notes
        </p>
      </div>
      
      <Button 
        onClick={onCreateNote}
        className="flex items-center gap-2 shadow-sm hover:shadow transition-all"
      >
        <Plus size={18} />
        Create Note
      </Button>
    </div>
  );
}