import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  action: string;
  response: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  name: string;
  aircraft: string;
  category: "preflight" | "startup" | "taxi" | "takeoff" | "cruise" | "descent" | "landing" | "shutdown" | "emergency";
  items: ChecklistItem[];
  description: string;
}

// PTFS-Specific Aircraft Checklists for ATC 24 Operations
const aircraftChecklists: Checklist[] = [
  // Boeing 737-800 (PTFS)
  {
    id: "b737-preflight",
    name: "Cold & Dark Startup",
    aircraft: "Boeing 737-800",
    category: "preflight",
    description: "PTFS Boeing 737 startup procedure",
    items: [
      { id: "1", action: "Spawn at gate", response: "CONFIRMED", completed: false },
      { id: "2", action: "Connect to ATC 24", response: "ONLINE", completed: false },
      { id: "3", action: "Battery", response: "ON", completed: false },
      { id: "4", action: "APU", response: "START", completed: false },
      { id: "5", action: "Navigation Lights", response: "ON", completed: false },
      { id: "6", action: "Beacon", response: "ON", completed: false },
      { id: "7", action: "Request IFR Clearance", response: "RECEIVED", completed: false },
      { id: "8", action: "Set Transponder", response: "ASSIGNED CODE", completed: false },
      { id: "9", action: "Load Flight Plan", response: "COMPLETE", completed: false },
      { id: "10", action: "Passenger Announcement", response: "BOARDING", completed: false }
    ]
  },
  {
    id: "b737-startup",
    name: "Engine Start & Taxi",
    aircraft: "Boeing 737-800", 
    category: "startup",
    description: "PTFS engine start and taxi preparation",
    items: [
      { id: "1", action: "Pushback clearance", response: "APPROVED", completed: false },
      { id: "2", action: "Engine 1 start", response: "STARTED", completed: false },
      { id: "3", action: "Engine 2 start", response: "STARTED", completed: false },
      { id: "4", action: "Engine parameters", response: "NORMAL", completed: false },
      { id: "5", action: "APU shutdown", response: "OFF", completed: false },
      { id: "6", action: "Request taxi clearance", response: "RECEIVED", completed: false },
      { id: "7", action: "Taxi lights", response: "ON", completed: false },
      { id: "8", action: "Flaps", response: "SET FOR TAKEOFF", completed: false },
      { id: "9", action: "Flight controls", response: "CHECKED", completed: false },
      { id: "10", action: "Cabin crew notification", response: "COMPLETE", completed: false }
    ]
  },
  // Airbus A320 (PTFS)
  {
    id: "a320-preflight",
    name: "PTFS A320 Setup",
    aircraft: "Airbus A320",
    category: "preflight", 
    description: "PTFS Airbus A320 game setup procedure",
    items: [
      { id: "1", action: "Select A320 aircraft", response: "SELECTED", completed: false },
      { id: "2", action: "Join ATC 24 server", response: "CONNECTED", completed: false },
      { id: "3", action: "Choose departure airport", response: "SET", completed: false },
      { id: "4", action: "Load flight plan", response: "PROGRAMMED", completed: false },
      { id: "5", action: "Set fuel quantity", response: "LOADED", completed: false },
      { id: "6", action: "Configure passengers", response: "BOARDED", completed: false },
      { id: "7", action: "Request startup clearance", response: "APPROVED", completed: false },
      { id: "8", action: "Set transponder code", response: "SQUAWKING", completed: false },
      { id: "9", action: "Complete pre-flight check", response: "VERIFIED", completed: false },
      { id: "10", action: "Ready for pushback", response: "CONFIRMED", completed: false }
    ]
  },
  // Cessna 172 (Training Aircraft - PTFS)
  {
    id: "c172-preflight",
    name: "PTFS Training Flight Setup",
    aircraft: "Cessna 172",
    category: "preflight",
    description: "Basic training aircraft preparation for PTFS",
    items: [
      { id: "1", action: "Select C172 in PTFS", response: "SELECTED", completed: false },
      { id: "2", action: "Choose training airport", response: "SET", completed: false },
      { id: "3", action: "Set fuel to 100%", response: "LOADED", completed: false },
      { id: "4", action: "Configure basic flight plan", response: "PROGRAMMED", completed: false },
      { id: "5", action: "Join ATC 24 as student", response: "CONNECTED", completed: false },
      { id: "6", action: "Request taxi clearance", response: "APPROVED", completed: false },
      { id: "7", action: "Practice radio calls", response: "ACKNOWLEDGED", completed: false },
      { id: "8", action: "Complete pattern work", response: "IN PROGRESS", completed: false },
      { id: "9", action: "Emergency procedures ready", response: "BRIEFED", completed: false },
      { id: "10", action: "Instructor contact", response: "ESTABLISHED", completed: false }
    ]
  },
  {
    id: "c172-startup",
    name: "PTFS Training Flight",
    aircraft: "Cessna 172",
    category: "startup",
    description: "Pattern work and training procedures",
    items: [
      { id: "1", action: "Engine startup procedure", response: "COMPLETE", completed: false },
      { id: "2", action: "Contact ground control", response: "ESTABLISHED", completed: false },
      { id: "3", action: "Taxi to active runway", response: "APPROVED", completed: false },
      { id: "4", action: "Pre-takeoff checklist", response: "COMPLETE", completed: false },
      { id: "5", action: "Request takeoff clearance", response: "CLEARED", completed: false },
      { id: "6", action: "Pattern entry", response: "STANDARD", completed: false },
      { id: "7", action: "Practice maneuvers", response: "COMPLETE", completed: false },
      { id: "8", action: "Landing approach", response: "STABLE", completed: false },
      { id: "9", action: "Touch and go", response: "EXECUTED", completed: false },
      { id: "10", action: "End flight procedures", response: "COMPLETE", completed: false }
    ]
  },
  // Emergency Checklists
  {
    id: "emergency-engine-fire",
    name: "Engine Fire",
    aircraft: "Boeing 737-800",
    category: "emergency",
    description: "Engine fire emergency procedure",
    items: [
      { id: "1", action: "Thrust Lever (affected engine)", response: "CLOSE", completed: false },
      { id: "2", action: "Fuel Control Switch", response: "CUTOFF", completed: false },
      { id: "3", action: "Engine Fire Switch", response: "PULL", completed: false },
      { id: "4", action: "Engine Fire Extinguisher", response: "DISCHARGE", completed: false },
      { id: "5", action: "If fire continues", response: "2ND BOTTLE", completed: false },
      { id: "6", action: "Land at nearest airport", response: "ASAP", completed: false }
    ]
  },
  {
    id: "emergency-rapid-descent",
    name: "Emergency Descent",
    aircraft: "Airbus A320",
    category: "emergency", 
    description: "Cabin pressurization emergency",
    items: [
      { id: "1", action: "Oxygen Masks", response: "DON & 100%", completed: false },
      { id: "2", action: "Crew Communication", response: "ESTABLISH", completed: false },
      { id: "3", action: "Transponder", response: "7700", completed: false },
      { id: "4", action: "Thrust Levers", response: "IDLE", completed: false },
      { id: "5", action: "Speed Brakes", response: "DEPLOYED", completed: false },
      { id: "6", action: "Descent Rate", response: "MAX", completed: false },
      { id: "7", action: "ATC", response: "DECLARE EMERGENCY", completed: false },
      { id: "8", action: "Level off", response: "10,000 FT", completed: false }
    ]
  }
];

export default function ChecklistsTab() {
  const [selectedAircraft, setSelectedAircraft] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeChecklist, setActiveChecklist] = useState<string | null>(null);
  const [checklistStates, setChecklistStates] = useState<Record<string, ChecklistItem[]>>({});
  const { toast } = useToast();

  const aircraftTypes = ["all", "Boeing 737-800", "Airbus A320", "Cessna 172"];
  const categories = [
    { id: "all", label: "All Phases", icon: "fas fa-list" },
    { id: "preflight", label: "Pre-flight", icon: "fas fa-clipboard-check" },
    { id: "startup", label: "Engine Start", icon: "fas fa-power-off" },
    { id: "taxi", label: "Taxi", icon: "fas fa-route" },
    { id: "takeoff", label: "Takeoff", icon: "fas fa-plane-departure" },
    { id: "cruise", label: "Cruise", icon: "fas fa-cloud" },
    { id: "descent", label: "Descent", icon: "fas fa-angle-down" },
    { id: "landing", label: "Landing", icon: "fas fa-plane-arrival" },
    { id: "shutdown", label: "Shutdown", icon: "fas fa-power-off" },
    { id: "emergency", label: "Emergency", icon: "fas fa-exclamation-triangle" }
  ];

  const filteredChecklists = aircraftChecklists.filter(checklist => {
    const matchesAircraft = selectedAircraft === "all" || checklist.aircraft === selectedAircraft;
    const matchesCategory = selectedCategory === "all" || checklist.category === selectedCategory;
    return matchesAircraft && matchesCategory;
  });

  const getChecklist = (checklistId: string) => {
    return checklistStates[checklistId] || aircraftChecklists.find(c => c.id === checklistId)?.items || [];
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    const currentItems = getChecklist(checklistId);
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    setChecklistStates(prev => ({ ...prev, [checklistId]: updatedItems }));
    
    const item = updatedItems.find(i => i.id === itemId);
    if (item?.completed) {
      toast({
        title: "Item Completed",
        description: `${item.action}: ${item.response}`,
      });
    }
  };

  const resetChecklist = (checklistId: string) => {
    const originalChecklist = aircraftChecklists.find(c => c.id === checklistId);
    if (originalChecklist) {
      setChecklistStates(prev => ({
        ...prev,
        [checklistId]: originalChecklist.items.map(item => ({ ...item, completed: false }))
      }));
      toast({
        title: "Checklist Reset",
        description: originalChecklist.name
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "preflight": return "text-aviation-blue bg-aviation-blue/20";
      case "startup": return "text-nav-green bg-nav-green/20";
      case "emergency": return "text-warning-orange bg-warning-orange/20";
      case "landing": return "text-caution-yellow bg-caution-yellow/20";
      default: return "text-text-muted bg-text-muted/20";
    }
  };

  const getCompletionPercentage = (checklistId: string) => {
    const items = getChecklist(checklistId);
    const completed = items.filter(item => item.completed).length;
    return items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
  };

  return (
    <div className="h-full flex bg-panel-bg">
      {/* Sidebar */}
      <div className="w-80 border-r border-panel-gray p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Flight Checklists</h2>
        
        {/* Aircraft Filter */}
        <div className="mb-6">
          <label className="text-sm font-medium text-text-muted mb-2 block">Aircraft Type</label>
          <select
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
            className="w-full p-2 bg-panel-gray border border-panel-gray rounded-md text-text-primary"
          >
            {aircraftTypes.map(aircraft => (
              <option key={aircraft} value={aircraft}>
                {aircraft === "all" ? "All Aircraft" : aircraft}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="text-sm font-medium text-text-muted mb-3 block">Flight Phase</label>
          <div className="space-y-2">
            {categories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start h-9"
                size="sm"
              >
                <i className={`${category.icon} mr-3 w-4`}></i>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Checklist List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Available Checklists
          </h3>
          {filteredChecklists.map(checklist => {
            const completion = getCompletionPercentage(checklist.id);
            return (
              <motion.div
                key={checklist.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    activeChecklist === checklist.id 
                      ? 'ring-2 ring-aviation-blue bg-aviation-blue/5' 
                      : 'border-panel-gray hover:shadow-cockpit'
                  }`}
                  onClick={() => setActiveChecklist(checklist.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-semibold text-text-primary">
                          {checklist.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {checklist.aircraft}
                        </CardDescription>
                      </div>
                      <Badge className={getCategoryColor(checklist.category)} variant="secondary">
                        {checklist.category.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {completion}% Complete
                      </span>
                      <div className="w-12 h-2 bg-panel-gray rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completion}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full ${
                            completion === 100 ? 'bg-nav-green' : 'bg-aviation-blue'
                          }`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeChecklist ? (
          <AnimatePresence>
            {(() => {
              const checklist = aircraftChecklists.find(c => c.id === activeChecklist);
              if (!checklist) return null;
              
              const items = getChecklist(activeChecklist);
              const completion = getCompletionPercentage(activeChecklist);

              return (
                <motion.div
                  key={activeChecklist}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-panel-gray">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary">{checklist.name}</h3>
                        <p className="text-text-secondary mt-1">{checklist.description}</p>
                        <div className="flex items-center mt-3 space-x-4">
                          <Badge className={getCategoryColor(checklist.category)}>
                            {checklist.category.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-text-muted">{checklist.aircraft}</span>
                          <span className="text-sm font-mono text-aviation-blue">
                            {completion}% Complete ({items.filter(i => i.completed).length}/{items.length})
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-x-3">
                        <Button
                          onClick={() => resetChecklist(activeChecklist)}
                          variant="outline"
                          size="sm"
                        >
                          <i className="fas fa-redo mr-2"></i>
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4 max-w-4xl">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className={`transition-all duration-200 ${
                            item.completed 
                              ? 'bg-nav-green/5 border-nav-green/30' 
                              : 'border-panel-gray hover:shadow-cockpit'
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <Checkbox
                                  checked={item.completed}
                                  onCheckedChange={() => toggleChecklistItem(activeChecklist, item.id)}
                                  className="h-5 w-5"
                                />
                                
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-text-primary font-medium">{item.action}</span>
                                  </div>
                                  <div>
                                    <span className={`font-mono text-sm px-2 py-1 rounded ${
                                      item.completed 
                                        ? 'bg-nav-green/20 text-nav-green' 
                                        : 'bg-panel-gray text-text-secondary'
                                    }`}>
                                      {item.response}
                                    </span>
                                  </div>
                                </div>
                                
                                {item.completed && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-nav-green"
                                  >
                                    <i className="fas fa-check-circle"></i>
                                  </motion.div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <i className="fas fa-clipboard-check text-6xl text-text-muted mb-4"></i>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Select a Checklist
              </h3>
              <p className="text-text-secondary">
                Choose a checklist from the sidebar to begin the procedure
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}