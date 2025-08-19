import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { aircraftTypes, type AircraftType } from "@shared/schema";
import { 
  CheckSquare, 
  Square, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plane
} from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  critical?: boolean;
  notes?: string;
}

interface Checklist {
  id: string;
  title: string;
  phase: "preflight" | "startup" | "taxi" | "takeoff" | "climb" | "cruise" | "descent" | "approach" | "landing" | "shutdown" | "emergency";
  aircraftType: AircraftType;
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
  estimatedTime: string;
  mandatory: boolean;
}

const professionalChecklists: Checklist[] = [
  {
    id: "a320-preflight",
    title: "Pre-flight Inspection",
    phase: "preflight",
    aircraftType: "Airbus A320",
    estimatedTime: "15 min",
    mandatory: true,
    items: [
      { id: "1", text: "Aircraft documents - CHECK", completed: false, critical: true },
      { id: "2", text: "Flight plan and weather - REVIEWED", completed: false, critical: true },
      { id: "3", text: "MCDU flight plan - ENTERED", completed: false },
      { id: "4", text: "External inspection - COMPLETED", completed: false, critical: true },
      { id: "5", text: "Fuel quantity - VERIFIED", completed: false, critical: true },
      { id: "6", text: "Weight and balance - CALCULATED", completed: false, critical: true }
    ],
    completedCount: 0,
    totalCount: 6
  },
  {
    id: "a320-startup",
    title: "Engine Start",
    phase: "startup",
    aircraftType: "Airbus A320",
    estimatedTime: "5 min",
    mandatory: true,
    items: [
      { id: "1", text: "Beacon - ON", completed: false, critical: true },
      { id: "2", text: "APU - START", completed: false },
      { id: "3", text: "Engine master switches - ON", completed: false, critical: true },
      { id: "4", text: "Engine parameters - CHECK", completed: false, critical: true },
      { id: "5", text: "APU bleed - OFF", completed: false }
    ],
    completedCount: 0,
    totalCount: 5
  },
  {
    id: "b737-preflight",
    title: "Pre-flight Inspection", 
    phase: "preflight",
    aircraftType: "Boeing 737",
    estimatedTime: "12 min",
    mandatory: true,
    items: [
      { id: "1", text: "Aircraft logbook - REVIEWED", completed: false, critical: true },
      { id: "2", text: "MEL/CDL items - CHECKED", completed: false },
      { id: "3", text: "Flight management computer - PROGRAMMED", completed: false },
      { id: "4", text: "Walk-around inspection - COMPLETED", completed: false, critical: true },
      { id: "5", text: "Fuel load - VERIFIED", completed: false, critical: true }
    ],
    completedCount: 0,
    totalCount: 5
  },
  {
    id: "b777-cruise",
    title: "Cruise Checklist",
    phase: "cruise", 
    aircraftType: "Boeing 777",
    estimatedTime: "3 min",
    mandatory: false,
    items: [
      { id: "1", text: "Altitude - SET", completed: false },
      { id: "2", text: "Autopilot - ENGAGED", completed: false },
      { id: "3", text: "Engine parameters - MONITOR", completed: false },
      { id: "4", text: "Fuel flow - MONITOR", completed: false },
      { id: "5", text: "Navigation - MONITOR", completed: false }
    ],
    completedCount: 0,
    totalCount: 5
  },
  {
    id: "a380-landing",
    title: "Landing Checklist",
    phase: "landing",
    aircraftType: "Airbus A380", 
    estimatedTime: "4 min",
    mandatory: true,
    items: [
      { id: "1", text: "Landing gear - DOWN", completed: false, critical: true },
      { id: "2", text: "Flaps - FULL", completed: false, critical: true },
      { id: "3", text: "Speed brakes - ARMED", completed: false },
      { id: "4", text: "Autobrakes - SET", completed: false },
      { id: "5", text: "Go-around altitude - SET", completed: false },
      { id: "6", text: "Landing clearance - RECEIVED", completed: false, critical: true }
    ],
    completedCount: 0,
    totalCount: 6
  }
];

export default function EnhancedChecklistsTab() {
  const [checklists, setChecklists] = useState<Checklist[]>(professionalChecklists);
  const [selectedAircraft, setSelectedAircraft] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedChecklist, setExpandedChecklist] = useState<string | null>(null);

  const filteredChecklists = checklists.filter(checklist => {
    const matchesAircraft = selectedAircraft === "all" || checklist.aircraftType === selectedAircraft;
    const matchesPhase = selectedPhase === "all" || checklist.phase === selectedPhase;
    const matchesSearch = checklist.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAircraft && matchesPhase && matchesSearch;
  });

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const completedCount = updatedItems.filter(item => item.completed).length;
        return { ...checklist, items: updatedItems, completedCount };
      }
      return checklist;
    }));
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "preflight": return "text-aviation-blue";
      case "startup": return "text-nav-green";
      case "takeoff": return "text-warning-orange";
      case "cruise": return "text-text-primary";
      case "landing": return "text-caution-yellow";
      case "emergency": return "text-red-500";
      default: return "text-text-muted";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "bg-nav-green";
    if (percentage >= 75) return "bg-caution-yellow";
    if (percentage >= 50) return "bg-warning-orange";
    return "bg-aviation-blue";
  };

  const phases = ["preflight", "startup", "taxi", "takeoff", "climb", "cruise", "descent", "approach", "landing", "shutdown", "emergency"];

  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray bg-gradient-to-r from-panel-bg to-panel-gray/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-warning-orange/20">
            <CheckSquare className="text-warning-orange" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              Aircraft Checklists
            </h2>
            <p className="text-text-muted">
              Professional checklists for multiple aircraft types
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-text-muted" />
            <Input
              placeholder="Search checklists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-panel-bg border-panel-gray"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Plane size={16} className="text-text-muted" />
            <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
              <SelectTrigger className="w-48 bg-panel-bg border-panel-gray">
                <SelectValue placeholder="Aircraft Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Aircraft</SelectItem>
                {aircraftTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-muted" />
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="w-40 bg-panel-bg border-panel-gray">
                <SelectValue placeholder="Flight Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {phases.map(phase => (
                  <SelectItem key={phase} value={phase}>
                    {phase.charAt(0).toUpperCase() + phase.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Checklists */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          <AnimatePresence>
            {filteredChecklists.map((checklist, index) => {
              const percentage = (checklist.completedCount / checklist.totalCount) * 100;
              const isExpanded = expandedChecklist === checklist.id;
              const criticalIncomplete = checklist.items.some(item => item.critical && !item.completed);
              
              return (
                <motion.div
                  key={checklist.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`
                    bg-panel-bg border-panel-gray transition-all duration-300
                    ${percentage === 100 ? 'ring-1 ring-nav-green/30' : ''}
                    ${criticalIncomplete ? 'ring-1 ring-red-500/30' : ''}
                    hover:border-aviation-blue/40
                  `}>
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => setExpandedChecklist(isExpanded ? null : checklist.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {percentage === 100 ? (
                              <CheckCircle2 className="text-nav-green" size={20} />
                            ) : criticalIncomplete ? (
                              <AlertTriangle className="text-red-500" size={20} />
                            ) : (
                              <Square className="text-text-muted" size={20} />
                            )}
                            
                            <div>
                              <CardTitle className="text-lg text-text-primary">
                                {checklist.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getPhaseColor(checklist.phase)}>
                                  {checklist.phase.toUpperCase()}
                                </Badge>
                                <Badge variant="secondary" className="bg-panel-gray text-text-secondary">
                                  {checklist.aircraftType}
                                </Badge>
                                {checklist.mandatory && (
                                  <Badge variant="outline" className="text-red-500 border-red-500/30">
                                    MANDATORY
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-mono text-text-primary">
                              {checklist.completedCount}/{checklist.totalCount}
                            </div>
                            <div className="text-xs text-text-muted flex items-center gap-1">
                              <Clock size={12} />
                              {checklist.estimatedTime}
                            </div>
                          </div>
                          
                          <div className="w-24">
                            <Progress 
                              value={percentage} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Separator />
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              {checklist.items.map((item, itemIndex) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIndex * 0.05 }}
                                  className={`
                                    flex items-center gap-3 p-3 rounded-lg transition-all
                                    ${item.completed 
                                      ? 'bg-nav-green/10 border-nav-green/20' 
                                      : item.critical 
                                        ? 'bg-red-500/10 border-red-500/20' 
                                        : 'bg-panel-gray/30'
                                    }
                                    border hover:bg-opacity-80
                                  `}
                                >
                                  <Checkbox
                                    checked={item.completed}
                                    onCheckedChange={() => toggleChecklistItem(checklist.id, item.id)}
                                    className="data-[state=checked]:bg-nav-green data-[state=checked]:border-nav-green"
                                  />
                                  
                                  <div className="flex-1">
                                    <div className={`
                                      font-medium transition-all
                                      ${item.completed 
                                        ? 'text-text-muted line-through' 
                                        : 'text-text-primary'
                                      }
                                    `}>
                                      {item.text}
                                      {item.critical && (
                                        <Badge variant="outline" className="ml-2 text-xs text-red-500 border-red-500/30">
                                          CRITICAL
                                        </Badge>
                                      )}
                                    </div>
                                    {item.notes && (
                                      <div className="text-sm text-text-muted mt-1">
                                        {item.notes}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredChecklists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckSquare size={48} className="text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No checklists found
            </h3>
            <p className="text-text-muted">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}