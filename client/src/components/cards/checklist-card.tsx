import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Checklist } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface ChecklistCardProps {
  checklist: Checklist;
}

export default function ChecklistCard({ checklist }: ChecklistCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateChecklistMutation = useMutation({
    mutationFn: async (updatedItems: typeof checklist.items) => {
      const completedCount = updatedItems.filter(item => item.completed).length;
      const response = await apiRequest("PATCH", `/api/checklists/${checklist.id}`, {
        items: updatedItems,
        completedCount,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklists"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update checklist.",
        variant: "destructive",
      });
    },
  });

  const handleItemToggle = (itemId: string, completed: boolean) => {
    const updatedItems = checklist.items.map(item =>
      item.id === itemId ? { ...item, completed } : item
    );
    updateChecklistMutation.mutate(updatedItems);
  };

  const getStatusColor = () => {
    if (checklist.completedCount === 0) return "text-text-muted";
    if (checklist.completedCount === checklist.totalCount) return "text-nav-green";
    return "text-caution-yellow";
  };

  const getStatusBg = () => {
    if (checklist.completedCount === 0) return "bg-text-muted/20";
    if (checklist.completedCount === checklist.totalCount) return "bg-nav-green/20";
    return "bg-caution-yellow/20";
  };

  const getStatusText = () => {
    if (checklist.completedCount === 0) return "Not Started";
    if (checklist.completedCount === checklist.totalCount) return "Complete";
    return `${checklist.completedCount}/${checklist.totalCount}`;
  };

  return (
    <div className="bg-panel-bg rounded-xl border border-panel-gray p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary" data-testid="checklist-title">
          {checklist.title}
        </h3>
        <span 
          className={`text-sm px-3 py-1 rounded-full ${getStatusColor()} ${getStatusBg()}`}
          data-testid="checklist-status"
        >
          {getStatusText()}
        </span>
      </div>
      
      <div className="space-y-3" data-testid="checklist-items">
        {checklist.items.map((item) => (
          <label 
            key={item.id}
            className="flex items-center space-x-3 cursor-pointer hover:bg-panel-gray/30 rounded p-2 transition-colors"
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
              className="border-panel-gray data-[state=checked]:bg-aviation-blue data-[state=checked]:border-aviation-blue"
              data-testid={`checkbox-${item.id}`}
            />
            <span 
              className={`text-sm transition-colors ${
                item.completed 
                  ? "line-through text-text-primary" 
                  : "text-text-secondary"
              }`}
              data-testid={`item-text-${item.id}`}
            >
              {item.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
