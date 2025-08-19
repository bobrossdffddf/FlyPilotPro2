import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useElevenLabs } from "@/hooks/use-elevenlabs";
import { useToast } from "@/hooks/use-toast";
import { airlineConfigs, detectAirlineFromCallsign, type AirlineVoiceConfig } from "@/data/airlines";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Star, 
  StarOff, 
  Search,
  Filter,
  Mic,
  HelpCircle,
  Globe,
  Plane
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
  const [selectedAirline, setSelectedAirline] = useState<AirlineVoiceConfig | null>(null);
  const [dualLanguage, setDualLanguage] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showVirtualMicHelp, setShowVirtualMicHelp] = useState(false);
  const [currentVoiceIndex, setCurrentVoiceIndex] = useState(0); // State to track the current voice index

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

    // Select appropriate voice based on announcement category and airline
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

      let textToSpeak = announcement.text;

      // Add dual language support
      if (dualLanguage && selectedAirline?.secondaryLanguage) {
        const translations = getAnnouncementTranslations(announcement, selectedAirline.secondaryLanguage);
        if (translations !== announcement.text) {
          textToSpeak = `${announcement.text} ... ${translations}`;
        }
      }

      await generateSpeech({
        text: textToSpeak,
        voice_id: voiceToUse.voice_id,
        stability: 0.7,
        similarity_boost: 0.8,
        style: selectedAirline?.accent === "British" ? 0.3 : 0.1,
        use_speaker_boost: true
      });

      toast({
        title: "Playing Announcement",
        description: `${announcement.title} with ${voiceToUse.name}`,
      });

      // Update voice index for next announcement
      setCurrentVoiceIndex(prevIndex => (prevIndex + 1) % voices.length);

      // Reset playing state when audio ends
      setTimeout(() => {
        setPlayingId(null);
      }, parseInt(announcement.duration) * 1000 * (dualLanguage ? 1.8 : 1));

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
              {voices.length > 0 && (
                <p className="text-xs text-text-muted mt-1">
                  Next voice: {voices[currentVoiceIndex % voices.length]?.name || 'Loading...'}
                </p>
              )}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Plane size={16} className="text-text-muted" />
              <Select 
                value={selectedAirline?.code || "auto"}
                onValueChange={(value) => {
                  if (value === "auto") {
                    setSelectedAirline(null);
                  } else {
                    const airline = airlineConfigs.find(a => a.code === value);
                    setSelectedAirline(airline || null);
                  }
                }}
              >
                <SelectTrigger className="w-48 bg-panel-bg border-panel-gray">
                  <SelectValue placeholder="Select Airline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect from callsign</SelectItem>
                  {airlineConfigs.map(airline => (
                    <SelectItem key={airline.code} value={airline.code}>
                      {airline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Globe size={16} className="text-text-muted" />
              <Switch
                checked={dualLanguage}
                onCheckedChange={setDualLanguage}
                disabled={!selectedAirline?.secondaryLanguage}
              />
              <Label className="text-sm text-text-muted">
                Dual Language
              </Label>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVirtualMicHelp(true)}
              className="text-text-muted hover:text-text-primary"
            >
              <HelpCircle size={16} className="mr-1" />
              Virtual Mic
            </Button>
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

      {/* Virtual Mic Help Dialog */}
      {showVirtualMicHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-panel-bg border border-panel-gray rounded-lg p-6 max-w-md mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-aviation-blue" size={24} />
              <h3 className="text-xl font-semibold text-text-primary">Virtual Microphone Setup</h3>
            </div>

            <Alert className="mb-4">
              <Mic className="h-4 w-4" />
              <AlertDescription className="text-text-secondary">
                To create a virtual microphone for live announcements:
                <br /><br />
                1. Install VoiceMeeter Banana (free software)
                <br />
                2. Set VoiceMeeter Input as your default microphone
                <br />
                3. Route your browser audio through VoiceMeeter
                <br />
                4. Use the PA System to play announcements that will be heard as if from a real microphone
                <br /><br />
                This allows you to use the professional announcements in flight simulators or real ATC communications.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setShowVirtualMicHelp(false)}
              className="w-full"
            >
              Got it!
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function getAnnouncementTranslations(announcement: Announcement, language: string): string {
  const translations: Record<string, Record<string, string>> = {
    "welcome-boarding": {
      "German": "Guten Tag, meine Damen und Herren, und willkommen an Bord. Im Namen des Kapitäns und der gesamten Besatzung freuen wir uns, Sie heute bei uns zu haben.",
      "French": "Bonjour mesdames et messieurs, et bienvenue à bord. Au nom du commandant et de tout l'équipage, nous sommes heureux de vous accueillir aujourd'hui.",
      "Spanish": "Buenos días señoras y señores, y bienvenidos a bordo. En nombre del capitán y toda la tripulación, nos complace tenerlos con nosotros hoy.",
      "Italian": "Buongiorno signore e signori, e benvenuti a bordo. A nome del capitano e di tutto l'equipaggio, siamo lieti di avervi con noi oggi.",
      "Dutch": "Goedemorgen dames en heren, en welkom aan boord. Namens de kapitein en de volledige bemanning zijn wij blij u vandaag bij ons te hebben.",
      "Swedish": "God morgon damer och herrar, och välkomna ombord. På kaptenens och hela besättningens vägnar är vi glada att ha er med oss idag.",
      "Japanese": "おはようございます、ご搭乗いただきありがとうございます。機長および乗務員一同、本日は当便をご利用いただき誠にありがとうございます。"
    },
    "safety-seatbelts": {
      "German": "Bitte stellen Sie sicher, dass Ihre Sicherheitsgurte fest angezogen sind und bleiben Sie angeschnallt, bis das Anschnallzeichen erlischt.",
      "French": "Veuillez vous assurer que vos ceintures de sécurité sont bien attachées et restez attachés jusqu'à ce que le signal de ceinture s'éteigne.",
      "Spanish": "Por favor asegúrense de que sus cinturones de seguridad estén bien abrochados y permanezcan abrochados hasta que se apague la signal.",
      "Italian": "Vi preghiamo di assicurarvi che le cinture di sicurezza siano ben allacciate e rimanere allacciati fino allo spegnimento del segnale.",
      "Dutch": "Zorg ervoor dat uw veiligheidsgordels goed vastgemaakt zijn en blijf vastgegord tot het gordelteiken uitgaat.",
      "Swedish": "Var vänliga se till att era säkerhetsbälten är ordentligt fastspända och håll dem på tills bältestecknet släcks.",
      "Japanese": "シートベルトをしっかりとお締めいただき、シートベルト着用サインが消灯するまでお席にお座りください。"
    },
    "boarding-complete": {
      "German": "Das Boarding ist abgeschlossen. Wir bereiten uns auf den Start vor. Vielen Dank für Ihre Geduld.",
      "French": "L'embarquement est terminé. Nous nous préparons au départ. Merci pour votre patience.",
      "Spanish": "El abordaje ha sido completado. Nos estamos preparando para la salida. Gracias por su paciencia.",
      "Italian": "L'imbarco è completato. Ci stiamo preparando per la partenza. Grazie per la vostra pazienza.",
      "Dutch": "Het boarden is voltooid. Wij bereiden ons voor op vertrek. Dank voor uw geduld.",
      "Swedish": "Ombordstigning är klar. Vi förbereder oss för avfärd. Tack för ert tålamod.",
      "Japanese": "ご搭乗手続きが完了いたしました。出発の準備をしております。お待ちいただきありがとうございます。"
    },
    "turbulence-warning": {
      "German": "Aufgrund von Turbulenzen bitten wir alle Passagiere, sich anzuschnallen und in ihren Sitzen zu bleiben.",
      "French": "En raison de turbulences, nous demandons à tous les passagers de boucler leur ceinture et de rester assis.",
      "Spanish": "Debido a turbulencias, pedimos a todos los pasajeros que se abrochen los cinturones y permanezcan sentados.",
      "Italian": "A causa di turbolenze, chiediamo a tutti i passeggeri di allacciare le cinture e rimanere seduti.",
      "Dutch": "Vanwege turbulentie vragen wij alle passagiers hun gordels vast te maken en te blijven zitten.",
      "Swedish": "På grund av turbulens ber vi alla passagerare att spänna fast bältena och sitta kvar.",
      "Japanese": "乱気流のため、全てのお客様にはシートベルトをお締めいただき、お席にお座りください。"
    },
    "descent-preparation": {
      "German": "Wir beginnen nun unseren Sinkflug. Bitte stellen Sie Ihre Sitze aufrecht und klappen Sie Ihre Tische ein.",
      "French": "Nous commençons maintenant notre descente. Veuillez redresser vos sièges et replier vos tables.",
      "Spanish": "Ahora comenzamos nuestro descenso. Por favor pongan sus asientos en posición vertical y guarden sus mesas.",
      "Italian": "Iniziamo ora la nostra discesa. Vi preghiamo di raddrizzare i sedili e ripiegare i tavolini.",
      "Dutch": "Wij beginnen nu onze daling. Zet uw stoelen rechtop en klap uw tafeltjes in.",
      "Swedish": "Vi börjar nu vår nedstigning. Vänligen räta upp era säten och fäll upp borden.",
      "Japanese": "降下を開始いたします。お座席を元の位置にお戻しいただき、テーブルをお片付けください。"
    }
  };

  return translations[announcement.id]?.[language] || announcement.text;
}