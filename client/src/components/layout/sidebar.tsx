import { useQuery } from "@tanstack/react-query";
import { FlightStatus } from "@shared/schema";
import { EnhancedAircraft } from "@shared/atc24-types";
import { queryClient } from "@/lib/queryClient";

type TabType = "announcements" | "charts" | "sids" | "notepad" | "checklists" | "weight" | "virtuemic";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedAircraft?: EnhancedAircraft;
}

export default function Sidebar({ activeTab, onTabChange, selectedAircraft }: SidebarProps) {
  const { data: flightStatus } = useQuery<FlightStatus>({
    queryKey: ["/api/flight-status"],
  });

  const tabs = [
    {
      id: "announcements" as TabType,
      label: "Announcements",
      icon: "fas fa-volume-up",
    },
    {
      id: "charts" as TabType,
      label: "Charts",
      icon: "fas fa-map",
    },
    {
      id: "sids" as TabType,
      label: "SIDs",
      icon: "fas fa-route",
    },
    {
      id: "notepad" as TabType,
      label: "Notepad",
      icon: "fas fa-sticky-note",
    },
    {
      id: "checklists" as TabType,
      label: "Checklists",
      icon: "fas fa-clipboard-check",
    },
    {
      id: "weight" as TabType,
      label: "Weight & Balance",
      icon: "fas fa-balance-scale",
    },
    {
      id: "virtuemic" as TabType,
      label: "Virtual Mic",
      icon: "fas fa-microphone",
    },
  ];

  const isActiveTab = (tabId: TabType) => activeTab === tabId;

  return (
    <aside 
      className="w-full lg:w-64 bg-panel-bg border-r border-panel-gray shadow-instrument"
      data-testid="sidebar-navigation"
    >
      {/* Header */}
      <div className="p-4 border-b border-panel-gray">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-aviation-blue rounded-lg flex items-center justify-center">
            <i className="fas fa-plane text-white text-lg" data-testid="app-icon"></i>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary" data-testid="app-title">
              24FLY
            </h1>
            <p className="text-sm text-text-muted">Commercial Assistant</p>
          </div>
        </div>
      </div>

      {/* Flight Status Panel */}
      <div className="p-4 border-b border-panel-gray bg-panel-gray/30">
        <div className="text-xs text-text-muted mb-2">CURRENT FLIGHT</div>
        <div className="flex justify-between items-center mb-2">
          <span 
            className="font-mono text-sm text-text-primary" 
            data-testid="flight-number"
          >
            {flightStatus?.flightNumber || "No Active Flight"}
          </span>
          <span 
            className={`text-xs px-2 py-1 rounded font-mono ${
              flightStatus?.status === "ACTIVE" 
                ? "bg-nav-green/20 text-nav-green" 
                : "bg-text-muted/20 text-text-muted"
            }`}
            data-testid="flight-status"
          >
            {flightStatus?.status || "INACTIVE"}
          </span>
        </div>
        <div className="text-xs text-text-secondary">
          <div data-testid="flight-route">{flightStatus?.route || "Route TBD"}</div>
          <div data-testid="flight-aircraft">{flightStatus?.aircraft || "Aircraft TBD"}</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-colors duration-200 ${
                isActiveTab(tab.id)
                  ? "bg-aviation-blue/30 border-l-4 border-aviation-blue"
                  : "hover:bg-aviation-blue/20"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <i 
                className={`${tab.icon} w-5 ${
                  isActiveTab(tab.id) ? "text-aviation-blue" : "text-text-secondary"
                }`}
              ></i>
              <span 
                className={`text-sm font-medium ${
                  isActiveTab(tab.id) ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-panel-gray">
          <div className="text-xs text-text-muted mb-3 px-3">QUICK ACTIONS</div>
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-warning-orange/20 rounded-lg transition-colors duration-200"
            data-testid="button-emergency-pa"
          >
            <i className="fas fa-exclamation-triangle text-warning-orange w-5"></i>
            <span className="text-sm text-warning-orange">Emergency PA</span>
          </button>
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-nav-green/20 rounded-lg transition-colors duration-200"
            data-testid="button-quiet-mode"
          >
            <i className="fas fa-volume-down text-nav-green w-5"></i>
            <span className="text-sm text-nav-green">Quiet Mode</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}