import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTTS } from "@/hooks/use-tts";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  category: "safety" | "service" | "captain" | "emergency";
  phase: string[];
  text: string;
  duration: string;
  priority: "low" | "medium" | "high" | "critical";
}

const announcements: Announcement[] = [
  {
    id: "welcome-boarding",
    title: "Welcome Aboard",
    category: "service",
    phase: ["boarding", "pre-flight"],
    text: "Ladies and gentlemen, welcome aboard. Please take your seats and stow your carry-on luggage in the overhead bins or under the seat in front of you. Ensure your seat belts are fastened and your seat backs and tray tables are in their full upright position.",
    duration: "25s",
    priority: "medium"
  },
  {
    id: "safety-demonstration",
    title: "Safety Demonstration",
    category: "safety",
    phase: ["pre-flight"],
    text: "Ladies and gentlemen, we are about to begin our safety demonstration. Please direct your attention to the flight attendants as they demonstrate the safety features of this aircraft.",
    duration: "15s",
    priority: "high"
  },
  {
    id: "seatbelt-sign",
    title: "Fasten Seat Belt Sign",
    category: "captain",
    phase: ["taxi", "takeoff", "turbulence", "descent", "landing"],
    text: "Ladies and gentlemen, the captain has turned on the fasten seat belt sign. Please return to your seats and fasten your seat belts. Thank you.",
    duration: "12s",
    priority: "high"
  },
  {
    id: "takeoff-preparation",
    title: "Prepare for Takeoff",
    category: "captain",
    phase: ["takeoff"],
    text: "Flight attendants, please prepare for takeoff. Ladies and gentlemen, we are next for departure. Please ensure your seat belts are securely fastened.",
    duration: "15s",
    priority: "high"
  },
  {
    id: "cruising-altitude",
    title: "Cruising Altitude",
    category: "captain",
    phase: ["cruise"],
    text: "Ladies and gentlemen, we have reached our cruising altitude of thirty-seven thousand feet. You are now free to move about the cabin. However, we recommend you keep your seat belt fastened while seated.",
    duration: "20s",
    priority: "medium"
  },
  {
    id: "cabin-service",
    title: "Cabin Service",
    category: "service",
    phase: ["cruise"],
    text: "Ladies and gentlemen, we will now begin our cabin service. Please have your payment ready if you wish to purchase refreshments. Thank you for your patience.",
    duration: "18s",
    priority: "low"
  },
  {
    id: "turbulence-warning",
    title: "Turbulence Warning",
    category: "captain",
    phase: ["cruise", "descent"],
    text: "Ladies and gentlemen, we are experiencing some turbulence. Please return to your seats immediately and fasten your seat belts. Flight attendants, please be seated.",
    duration: "16s",
    priority: "critical"
  },
  {
    id: "descent-announcement",
    title: "Beginning Descent",
    category: "captain",
    phase: ["descent"],
    text: "Ladies and gentlemen, we are beginning our descent into our destination. Please ensure your seat belts are fastened, seat backs upright, and tray tables stowed.",
    duration: "18s",
    priority: "high"
  },
  {
    id: "landing-preparation",
    title: "Prepare for Landing",
    category: "captain",
    phase: ["approach", "landing"],
    text: "Flight attendants, please prepare for landing. Ladies and gentlemen, we are on final approach. Please ensure all carry-on items are stowed and your seat belts are securely fastened.",
    duration: "20s",
    priority: "high"
  },
  {
    id: "arrival-announcement",
    title: "Arrival Welcome",
    category: "captain",
    phase: ["arrival"],
    text: "Ladies and gentlemen, welcome to your destination. Please remain seated with your seat belts fastened until the aircraft has come to a complete stop and the seat belt sign is turned off.",
    duration: "22s",
    priority: "medium"
  },
  {
    id: "emergency-evacuation",
    title: "Emergency Evacuation",
    category: "emergency",
    phase: ["emergency"],
    text: "Ladies and gentlemen, this is an emergency. Please remain calm and follow the instructions of the flight attendants. Leave all personal belongings and proceed to the nearest exit immediately.",
    duration: "20s",
    priority: "critical"
  }
];

export default function AnnouncementsTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeAnnouncement, setActiveAnnouncement] = useState<string | null>(null);
  const { speak, stop, isPlaying, speakAnnouncement, isSupported } = useTTS();
  const { toast } = useToast();

  const categories = [
    { id: "all", label: "All Announcements", icon: "fas fa-list" },
    { id: "safety", label: "Safety", icon: "fas fa-shield-alt" },
    { id: "service", label: "Service", icon: "fas fa-concierge-bell" },
    { id: "captain", label: "Captain", icon: "fas fa-user-tie" },
    { id: "emergency", label: "Emergency", icon: "fas fa-exclamation-triangle" }
  ];

  const filteredAnnouncements = selectedCategory === "all" 
    ? announcements 
    : announcements.filter(a => a.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "safety": return "text-caution-yellow bg-caution-yellow/20";
      case "service": return "text-nav-green bg-nav-green/20";
      case "captain": return "text-aviation-blue bg-aviation-blue/20";
      case "emergency": return "text-warning-orange bg-warning-orange/20";
      default: return "text-text-muted bg-text-muted/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-warning-orange bg-warning-orange/20";
      case "high": return "text-caution-yellow bg-caution-yellow/20";
      case "medium": return "text-aviation-blue bg-aviation-blue/20";
      case "low": return "text-nav-green bg-nav-green/20";
      default: return "text-text-muted bg-text-muted/20";
    }
  };

  const handlePlayAnnouncement = (announcement: Announcement) => {
    if (isPlaying) {
      stop();
    }
    
    setActiveAnnouncement(announcement.id);
    speak(announcement.text, {
      rate: 0.85,
      volume: 0.9,
      pitch: 1.0
    });

    toast({
      title: "Playing Announcement",
      description: announcement.title,
    });

    // Clear active announcement when done
    setTimeout(() => {
      setActiveAnnouncement(null);
    }, parseInt(announcement.duration) * 1000);
  };

  const handleQuickAnnouncement = (type: string) => {
    speakAnnouncement(type);
    toast({
      title: "Quick Announcement",
      description: `Playing ${type} announcement`,
    });
  };

  if (!isSupported) {
    return (
      <div className="h-full flex items-center justify-center bg-panel-bg">
        <div className="text-center">
          <i className="fas fa-volume-mute text-6xl text-text-muted mb-4"></i>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Text-to-Speech Not Supported
          </h3>
          <p className="text-text-secondary">
            Your browser doesn't support the Web Speech API required for announcements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-panel-bg">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Passenger Announcements</h2>
            <p className="text-text-secondary mt-1">Professional cabin announcements with TTS</p>
          </div>
          
          {isPlaying && (
            <Button
              onClick={stop}
              variant="outline"
              className="border-warning-orange text-warning-orange hover:bg-warning-orange/10"
            >
              <i className="fas fa-stop mr-2"></i>
              Stop All
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: "welcome", label: "Welcome", icon: "fas fa-hand-wave" },
            { type: "seatbelt", label: "Seat Belt", icon: "fas fa-user-check" },
            { type: "cruising", label: "Cruising", icon: "fas fa-cloud" },
            { type: "turbulence", label: "Turbulence", icon: "fas fa-exclamation-triangle" }
          ].map(quick => (
            <Button
              key={quick.type}
              onClick={() => handleQuickAnnouncement(quick.type)}
              variant="outline"
              className="h-12 border-panel-gray text-text-secondary hover:text-text-primary hover:bg-aviation-blue/10"
              disabled={isPlaying}
            >
              <i className={`${quick.icon} mr-2`}></i>
              {quick.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-64 border-r border-panel-gray p-4">
          <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start h-10"
              >
                <i className={`${category.icon} mr-3 w-4`}></i>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Announcements List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-panel-gray transition-all duration-300 ${
                    activeAnnouncement === announcement.id 
                      ? 'ring-2 ring-aviation-blue bg-aviation-blue/5' 
                      : 'hover:shadow-cockpit'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-text-primary flex items-center">
                            {announcement.title}
                            {activeAnnouncement === announcement.id && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="ml-2"
                              >
                                <i className="fas fa-volume-up text-aviation-blue"></i>
                              </motion.div>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                              {announcement.category.toUpperCase()}
                            </span>
                            <span className="mx-2">•</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority.toUpperCase()}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-text-muted">{announcement.duration}</span>
                          </CardDescription>
                        </div>
                        
                        <Button
                          onClick={() => handlePlayAnnouncement(announcement)}
                          disabled={isPlaying && activeAnnouncement !== announcement.id}
                          className="ml-4"
                          size="sm"
                        >
                          <i className={`fas ${
                            activeAnnouncement === announcement.id 
                              ? 'fa-stop' 
                              : 'fa-play'
                          } mr-2`}></i>
                          {activeAnnouncement === announcement.id ? 'Stop' : 'Play'}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-text-secondary leading-relaxed mb-4">
                        {announcement.text}
                      </p>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-text-muted">Flight Phases: </span>
                          <div className="inline-flex flex-wrap gap-1 mt-1">
                            {announcement.phase.map(phase => (
                              <Badge key={phase} variant="outline" className="text-xs">
                                {phase}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}