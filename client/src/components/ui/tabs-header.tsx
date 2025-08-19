import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Volume2, 
  Map, 
  Route, 
  FileText, 
  CheckSquare, 
  Scale,
  Settings,
  Gauge,
  HelpCircle
} from "lucide-react";

type TabType = "announcements" | "charts" | "sids" | "notepad" | "checklists" | "weight" | "instruments" | "help";

interface TabsHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  {
    id: "announcements" as TabType,
    label: "PA System",
    icon: Volume2,
    color: "text-aviation-blue"
  },
  {
    id: "charts" as TabType,
    label: "Charts",
    icon: Map,
    color: "text-nav-green"
  },
  {
    id: "sids" as TabType,
    label: "SIDs/STARs",
    icon: Route,
    color: "text-caution-yellow"
  },
  {
    id: "notepad" as TabType,
    label: "Flight Log",
    icon: FileText,
    color: "text-text-primary"
  },
  {
    id: "checklists" as TabType,
    label: "Checklists",
    icon: CheckSquare,
    color: "text-warning-orange"
  },
  {
    id: "weight" as TabType,
    label: "W&B",
    icon: Scale,
    color: "text-text-secondary"
  },
  {
    id: "instruments" as TabType,
    label: "Instruments",
    icon: Gauge,
    color: "text-nav-green"
  },
  {
    id: "help" as TabType,
    label: "Help",
    icon: HelpCircle,
    color: "text-aviation-blue"
  }
];

export function TabsHeader({ activeTab, onTabChange }: TabsHeaderProps) {
  return (
    <div className="border-b border-panel-gray bg-panel-bg">
      <div className="flex overflow-x-auto scrollbar-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex-shrink-0 h-16 px-6 rounded-none border-b-2 transition-all duration-200
                ${isActive 
                  ? 'border-aviation-blue bg-aviation-blue/10 text-aviation-blue' 
                  : 'border-transparent hover:bg-panel-gray/50 text-text-muted hover:text-text-primary'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon 
                  size={20} 
                  className={isActive ? 'text-aviation-blue' : 'text-text-muted'} 
                />
                <span className="text-xs font-medium">{tab.label}</span>
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-aviation-blue"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}