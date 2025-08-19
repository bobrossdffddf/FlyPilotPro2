import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTTS } from "@/hooks/use-tts";

interface AudioPreset {
  id: string;
  name: string;
  description: string;
  text: string;
  category: "atc" | "pilot" | "cabin" | "emergency";
}

const audioPresets: AudioPreset[] = [
  // ATC Communications
  {
    id: "atc-clearance",
    name: "IFR Clearance",
    category: "atc",
    description: "Standard IFR clearance delivery",
    text: "United 123, cleared to Los Angeles Airport via the STAR arrival, flight level 370, squawk 2157"
  },
  {
    id: "atc-taxi",
    name: "Taxi Clearance", 
    category: "atc",
    description: "Ground control taxi instructions",
    text: "United 123, taxi to runway 25L via taxiways Alpha, Bravo, hold short of runway 25L"
  },
  {
    id: "atc-takeoff",
    name: "Takeoff Clearance",
    category: "atc", 
    description: "Tower takeoff authorization",
    text: "United 123, runway 25L, wind 240 at 8, cleared for takeoff"
  },
  
  // Pilot Communications
  {
    id: "pilot-readback",
    name: "Clearance Readback",
    category: "pilot",
    description: "Standard pilot readback",
    text: "Cleared to Los Angeles Airport via STAR arrival, flight level 370, squawk 2157, United 123"
  },
  {
    id: "pilot-request",
    name: "Altitude Request",
    category: "pilot", 
    description: "Requesting flight level change",
    text: "Center, United 123 requesting flight level 390 for better winds"
  },
  
  // Cabin Announcements
  {
    id: "cabin-boarding",
    name: "Boarding Complete",
    category: "cabin",
    description: "Final boarding announcement",
    text: "Ladies and gentlemen, boarding is now complete. Please ensure your seatbelts are fastened and tray tables are in the upright position"
  },
  {
    id: "cabin-descent",
    name: "Descent Announcement", 
    category: "cabin",
    description: "Beginning descent preparation",
    text: "Ladies and gentlemen, we are beginning our descent into Los Angeles. Please return to your seats and prepare for landing"
  },
  
  // Emergency
  {
    id: "emergency-pan",
    name: "Pan Pan Call",
    category: "emergency",
    description: "Urgency declaration",
    text: "Pan pan, pan pan, pan pan. United 123 declaring medical emergency, requesting priority handling to nearest suitable airport"
  }
];

export default function VirtualMicTab() {
  const [customText, setCustomText] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioDevice, setAudioDevice] = useState("default");
  const [micGain, setMicGain] = useState(75);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { speak, isPlaying, stop } = useTTS();

  const handlePlayPreset = (preset: AudioPreset) => {
    setSelectedPreset(preset.id);
    speak(preset.text, {
      rate: 0.85,
      pitch: 1.0,
      volume: micGain / 100
    });
    
    toast({
      title: "Playing Audio",
      description: `${preset.name} - ${preset.category.toUpperCase()}`
    });
  };

  const handlePlayCustom = () => {
    if (!customText.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to speak",
        variant: "destructive"
      });
      return;
    }
    
    speak(customText, {
      rate: 0.85,
      pitch: 1.0,
      volume: micGain / 100
    });
  };

  const handleVirtualMic = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Virtual Mic Active",
        description: "Audio will be routed to virtual audio device for Discord streaming"
      });
    } else {
      toast({
        title: "Virtual Mic Stopped",
        description: "Audio routing deactivated"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "atc": return "bg-aviation-blue/20 text-aviation-blue";
      case "pilot": return "bg-nav-green/20 text-nav-green";
      case "cabin": return "bg-caution-yellow/20 text-caution-yellow";
      case "emergency": return "bg-warning-orange/20 text-warning-orange";
      default: return "bg-text-muted/20 text-text-muted";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "atc": return "fas fa-tower-cell";
      case "pilot": return "fas fa-user-pilot";
      case "cabin": return "fas fa-users";
      case "emergency": return "fas fa-exclamation-triangle";
      default: return "fas fa-microphone";
    }
  };

  return (
    <div className="h-full flex flex-col bg-panel-bg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Virtual Microphone</h2>
          <p className="text-text-secondary mt-1">Professional aviation audio for Discord streaming</p>
        </div>
        
        <Button
          onClick={handleVirtualMic}
          className={`${
            isRecording 
              ? 'bg-warning-orange hover:bg-warning-orange/80' 
              : 'bg-nav-green hover:bg-nav-green/80'
          }`}
        >
          <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'} mr-2`}></i>
          {isRecording ? 'Stop Virtual Mic' : 'Start Virtual Mic'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audio Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-panel-gray">
            <CardHeader>
              <CardTitle className="text-text-primary">Audio Settings</CardTitle>
              <CardDescription>Configure virtual microphone output</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audio-device" className="text-text-muted">Virtual Audio Device</Label>
                <select
                  id="audio-device"
                  value={audioDevice}
                  onChange={(e) => setAudioDevice(e.target.value)}
                  className="w-full mt-1 p-2 bg-panel-gray border border-panel-gray rounded-md text-text-primary"
                >
                  <option value="default">Default Output</option>
                  <option value="voicemeeter">VoiceMeeter Virtual</option>
                  <option value="vac">Virtual Audio Cable</option>
                  <option value="obs">OBS Virtual Camera</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="mic-gain" className="text-text-muted">
                  Audio Level: {micGain}%
                </Label>
                <Input
                  id="mic-gain"
                  type="range"
                  min="0"
                  max="100"
                  value={micGain}
                  onChange={(e) => setMicGain(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className={`flex items-center space-x-2 p-2 rounded ${
                  isRecording ? 'bg-warning-orange/20' : 'bg-panel-gray'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isRecording ? 'bg-warning-orange animate-pulse' : 'bg-text-muted'
                  }`}></div>
                  <span className="text-sm text-text-secondary">
                    {isRecording ? 'Broadcasting to Discord' : 'Virtual mic inactive'}
                  </span>
                </div>
                
                <div className="text-xs text-text-muted p-2 bg-panel-gray/50 rounded">
                  <strong>Setup Guide:</strong><br/>
                  1. Install VoiceMeeter or Virtual Audio Cable<br/>
                  2. Set Discord input to virtual device<br/>
                  3. Enable virtual mic in this app<br/>
                  4. Play aviation audio through Discord
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Text */}
          <Card className="border-panel-gray">
            <CardHeader>
              <CardTitle className="text-text-primary">Custom Audio</CardTitle>
              <CardDescription>Enter your own text to speak</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-text" className="text-text-muted">Custom Text</Label>
                <textarea
                  id="custom-text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter aviation communication text..."
                  className="w-full mt-1 p-3 bg-panel-gray border border-panel-gray rounded-md text-text-primary h-24 resize-none"
                />
              </div>
              
              <Button 
                onClick={handlePlayCustom}
                disabled={!customText.trim() || isPlaying}
                className="w-full"
              >
                <i className="fas fa-play mr-2"></i>
                {isPlaying ? 'Playing...' : 'Play Custom Text'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Audio Presets */}
        <div className="lg:col-span-2">
          <Card className="border-panel-gray h-full">
            <CardHeader>
              <CardTitle className="text-text-primary">Aviation Audio Presets</CardTitle>
              <CardDescription>Professional aviation communications for PTFS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audioPresets.map((preset) => (
                  <motion.div
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedPreset === preset.id && isPlaying
                          ? 'ring-2 ring-aviation-blue bg-aviation-blue/5' 
                          : 'border-panel-gray hover:shadow-cockpit'
                      }`}
                      onClick={() => handlePlayPreset(preset)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm font-semibold text-text-primary flex items-center">
                              <i className={`${getCategoryIcon(preset.category)} mr-2 text-sm`}></i>
                              {preset.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {preset.description}
                            </CardDescription>
                          </div>
                          <Badge className={getCategoryColor(preset.category)} variant="secondary">
                            {preset.category.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-text-secondary mb-3 italic">
                          "{preset.text}"
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-muted">
                            Click to play
                          </span>
                          {selectedPreset === preset.id && isPlaying && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="text-aviation-blue"
                            >
                              <i className="fas fa-volume-up"></i>
                            </motion.div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}