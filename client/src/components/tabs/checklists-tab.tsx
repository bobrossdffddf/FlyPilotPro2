import { useQuery } from "@tanstack/react-query";
import { Checklist } from "@shared/schema";
import ChecklistCard from "@/components/cards/checklist-card";
import { Button } from "@/components/ui/button";

export default function ChecklistsTab() {
  const { data: checklists = [], isLoading } = useQuery<Checklist[]>({
    queryKey: ["/api/checklists"],
  });

  const getStatusColor = (completedCount: number, totalCount: number) => {
    if (completedCount === 0) return "text-text-muted";
    if (completedCount === totalCount) return "text-nav-green";
    return "text-caution-yellow";
  };

  const getStatusBg = (completedCount: number, totalCount: number) => {
    if (completedCount === 0) return "bg-text-muted/20";
    if (completedCount === totalCount) return "bg-nav-green/20";
    return "bg-caution-yellow/20";
  };

  return (
    <div className="h-full">
      <header className="bg-panel-bg border-b border-panel-gray p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary" data-testid="page-title">
              Flight Checklists
            </h2>
            <p className="text-text-muted mt-1">Interactive checklists for all flight phases</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              className="bg-aviation-blue hover:bg-aviation-blue/80"
              data-testid="button-new-checklist"
            >
              <i className="fas fa-plus mr-2"></i>New Checklist
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-panel-bg rounded-xl border border-panel-gray p-6 animate-pulse">
                <div className="h-4 bg-panel-gray rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-3 bg-panel-gray rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : checklists.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-checklists">
            <i className="fas fa-clipboard-list text-6xl text-text-muted mb-4"></i>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Checklists</h3>
            <p className="text-text-secondary">Create your first checklist to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklists.map((checklist) => (
              <ChecklistCard
                key={checklist.id}
                checklist={checklist}
                data-testid={`checklist-${checklist.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
