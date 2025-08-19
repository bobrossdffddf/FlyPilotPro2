import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useElevenLabs } from "@/hooks/use-elevenlabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Star, 
  StarOff, 
  Search,
  Filter,
  Mic
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  category: "safety" | "service" | "captain" | "emergency";
  phase: string[];
  text: string;
  duration: string;
  priority: "low" | "medium" | "high" | "critical";
  isFavorite?: boolean;
}

const professionalAnnouncements: Announcement[] = [
  {
    id: "welcome-boarding",
    title: "Welcome Aboard",
    category: "service",
    phase: ["boarding"],
    text: "Good morning, ladies and gentlemen, and welcome aboard. On behalf of the captain and the entire crew, we're pleased to have you with us today. Please take your seats and stow your carry-on luggage in the overhead bins or under the seat in front of you. Thank you for choosing us for your travel needs.",
    duration: "30s",
    priority: "medium",
    isFavorite: false
  },
  {
    id: "safety-demo",
    title: "Safety Demonstration",
    category: "safety",
    phase: ["pre-flight"],
    text: "Ladies and gentlemen, we are about to begin our safety demonstration. Please direct your attention to the flight attendants as they demonstrate the safety features of this aircraft. Your safety is our primary concern, and we ask for your complete attention during this presentation.",
    duration: "20s",
    priority: "high",
    isFavorite: true
  },
  {
    id: "captain-departure",
    title: "Captain's Departure Announcement",
    category: "captain",
    phase: ["taxi", "departure"],
    text: "Good morning from the flight deck. This is your captain speaking. We've been cleared for departure and expect an on-time arrival. Weather at our destination is favorable. Flight attendants, please prepare for departure. Ladies and gentlemen, please ensure your seat belts are securely fastened.",
    duration: "25s",
    priority: "high",
    isFavorite: true
  },
  {
    id: "cruising-altitude",
    title: "Cruising Altitude",
    category: "captain",
    phase: ["cruise"],
    text: "Ladies and gentlemen, this is your captain. We've reached our cruising altitude of thirty-seven thousand feet. You're now free to move about the cabin, however we recommend you keep your seat belt fastened while seated. Flight attendants will begin cabin service shortly.",
    duration: "22s",
    priority: "medium",
    isFavorite: false
  },
  {
    id: "turbulence-warning",
    title: "Turbulence Advisory",
    category: "captain",
    phase: ["cruise", "descent"],
    text: "Ladies and gentlemen, we're encountering some light turbulence. For your safety, please return to your seats and fasten your seat belts. Flight attendants, please be seated. We expect this to be brief and will update you shortly.",
    duration: "18s",
    priority: "high",
    isFavorite: false
  },
  {
    id: "final-descent",
    title: "Final Approach",
    category: "captain",
    phase: ["descent", "approach"],
    text: "Ladies and gentlemen, we've begun our final descent. Please return to your seats, fasten your seat belts, and ensure your seat backs and tray tables are in their upright position. Flight attendants, please prepare the cabin for landing.",
    duration: "20s",
    priority: "high",
    isFavorite: true
  },
  {
    id: "landing-complete",
    title: "Welcome to Destination",
    category: "captain",
    phase: ["landing", "taxi"],
    text: "Ladies and gentlemen, welcome to our destination. Please remain seated with your seat belts fastened until we reach the gate and the captain has turned off the seat belt sign. Thank you for flying with us today.",
    duration: "18s",
    priority: "medium",
    isFavorite: false
  }
];

export default function EnhancedAnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(professionalAnnouncements);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<string>("captain");
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const { 
    voices, 
    isLoading, 
    currentAudio, 
    fetchVoices, 
    generateSpeech, 
    stopSpeech,
    getAviationVoices 
  } = useElevenLabs();
  const { toast } = useToast();

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedCategory === "all" || announcement.category === selectedCategory;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayAnnouncement = async (announcement: Announcement) => {
    if (playingId === announcement.id && currentAudio) {
      stopSpeech();
      setPlayingId(null);
      return;
    }

    const aviationVoices = getAviationVoices();
    let voiceToUse = aviationVoices.captain;

    // Select appropriate voice based on announcement category
    switch (announcement.category) {
      case "captain":
        voiceToUse = aviationVoices.captain;
        break;
      case "service":
        voiceToUse = aviationVoices.attendant;
        break;
      case "safety":
        voiceToUse = aviationVoices.crew;
        break;
      case "emergency":
        voiceToUse = aviationVoices.captain;
        break;
      default:
        voiceToUse = aviationVoices.captain;
    }

    if (!voiceToUse) {
      toast({
        title: "Voice Not Available",
        description: "Please ensure ElevenLabs voices are loaded",
        variant: "destructive"
      });
      return;
    }

    try {
      setPlayingId(announcement.id);
      await generateSpeech({
        text: announcement.text,
        voice_id: voiceToUse.voice_id,
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.1,
        use_speaker_boost: true
      });

      // Reset playing state when audio ends
      setTimeout(() => {
        setPlayingId(null);
      }, parseInt(announcement.duration) * 1000);

    } catch (error) {
      setPlayingId(null);
      console.error('Failed to play announcement:', error);
    }
  };

  const toggleFavorite = (id: string) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, isFavorite: !ann.isFavorite } : ann
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-warning-orange text-black";
      case "medium": return "bg-caution-yellow text-black";
      case "low": return "bg-nav-green text-black";
      default: return "bg-panel-gray text-text-primary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "captain": return "👨‍✈️";
      case "service": return "✈️";
      case "safety": return "🛡️";
      case "emergency": return "🚨";
      default: return "📢";
    }
  };

  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-panel-gray bg-gradient-to-r from-panel-bg to-panel-gray/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-aviation-blue/20">
              <Volume2 className="text-aviation-blue" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">
                PA System Control
              </h2>
              <p className="text-text-muted">
                Professional cabin announcements with realistic voice synthesis
              </p>
            </div>
          </div>
          
          {currentAudio && (
            <Button 
              onClick={stopSpeech}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              <VolumeX size={16} className="mr-2" />
              Stop Audio
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-text-muted" />
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-panel-bg border-panel-gray"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-muted" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 bg-panel-bg border-panel-gray">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="captain">Captain</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Mic size={16} className="text-text-muted" />
            <Badge variant="outline" className="bg-nav-green/10 text-nav-green border-nav-green/30">
              ElevenLabs Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredAnnouncements.map((announcement, index) => {
              const isPlaying = playingId === announcement.id;
              
              return (
                <motion.div
                  key={announcement.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`
                    group cursor-pointer transition-all duration-300 hover:shadow-lg
                    ${isPlaying 
                      ? 'ring-2 ring-aviation-blue bg-aviation-blue/5' 
                      : 'bg-panel-bg hover:bg-panel-gray/30'
                    }
                    border-panel-gray hover:border-aviation-blue/40
                  `}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(announcement.category)}</span>
                          <div>
                            <CardTitle className="text-lg text-text-primary group-hover:text-aviation-blue transition-colors">
                              {announcement.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getPriorityColor(announcement.priority)}`}
                              >
                                {announcement.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {announcement.duration}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(announcement.id);
                          }}
                          className="opacity-70 hover:opacity-100"
                        >
                          {announcement.isFavorite ? 
                            <Star size={16} className="fill-caution-yellow text-caution-yellow" /> :
                            <StarOff size={16} className="text-text-muted" />
                          }
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="text-text-secondary mb-4 line-clamp-3">
                        {announcement.text}
                      </CardDescription>
                      
                      <Separator className="mb-4" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {announcement.phase.map(phase => (
                            <Badge 
                              key={phase} 
                              variant="outline" 
                              className="text-xs bg-panel-gray/50"
                            >
                              {phase}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button
                          onClick={() => handlePlayAnnouncement(announcement)}
                          disabled={isLoading}
                          className={`
                            transition-all duration-200
                            ${isPlaying 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-aviation-blue hover:bg-aviation-blue/80'
                            }
                          `}
                        >
                          {isPlaying ? (
                            <>
                              <Pause size={16} className="mr-2" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play size={16} className="mr-2" />
                              Play
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredAnnouncements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Volume2 size={48} className="text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No announcements found
            </h3>
            <p className="text-text-muted">
              Try adjusting your search or category filter
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}