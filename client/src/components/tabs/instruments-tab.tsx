import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { EnhancedAircraft } from "@shared/atc24-types";
import { Maximize2, Radar, Minimize2, X } from "lucide-react";

interface PopoutRadar {
  id: string;
  position: { x: number; y: number };
}

export default function InstrumentsTab() {
  const [popoutRadars, setPopoutRadars] = useState<PopoutRadar[]>([]);
  
  const { data: aircraft = [] } = useQuery<EnhancedAircraft[]>({
    queryKey: ['/api/aircraft'],
    refetchInterval: 2000
  });

  const handlePopoutRadar = () => {
    const newRadar: PopoutRadar = {
      id: `radar-${Date.now()}`,
      position: { x: 100, y: 100 }
    };
    setPopoutRadars(prev => [...prev, newRadar]);
  };

  const handleClosePopout = (id: string) => {
    setPopoutRadars(prev => prev.filter(radar => radar.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-nav-green/20">
              <Radar className="text-nav-green" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">
                Air Traffic Control Radar
              </h2>
              <p className="text-text-muted">
                Real-time aircraft tracking and navigation display
              </p>
            </div>
          </div>
          <Button onClick={handlePopoutRadar} variant="outline">
            <Maximize2 size={16} className="mr-2" />
            Pop Out Radar
          </Button>
        </div>
      </div>

      {/* Main Radar Display */}
      <div className="flex-1 p-6">
        <Card className="h-full bg-panel-bg border-panel-gray">
          <CardContent className="h-full p-6">
            <RadarDisplay aircraft={aircraft} />
          </CardContent>
        </Card>
      </div>

      {/* Popout Radars */}
      <AnimatePresence>
        {popoutRadars.map((radar) => (
          <PopoutRadarDisplay
            key={radar.id}
            aircraft={aircraft}
            onClose={() => handleClosePopout(radar.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function RadarDisplay({ aircraft }: { aircraft: EnhancedAircraft[] }) {
  const [range, setRange] = useState(100); // nautical miles
  
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Radar Scope */}
      <svg className="w-full h-full" viewBox="0 0 500 500">
        {/* Radar rings */}
        {[1, 2, 3, 4].map(ring => (
          <circle
            key={ring}
            cx="250"
            cy="250"
            r={ring * 60}
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        
        {/* Compass lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
          <line
            key={angle}
            x1="250"
            y1="250"
            x2={250 + 240 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={250 + 240 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke="#00ff00"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}
        
        {/* Center dot */}
        <circle cx="250" cy="250" r="2" fill="#00ff00" />
        
        {/* Aircraft positions */}
        {aircraft.map((ac, index) => {
          const x = 250 + (ac.longitude * 10); // Simple projection
          const y = 250 - (ac.latitude * 10);
          
          return (
            <g key={ac.callsign}>
              {/* Aircraft symbol */}
              <polygon
                points={`${x},${y-5} ${x+3},${y+3} ${x},${y+1} ${x-3},${y+3}`}
                fill="#ffff00"
                stroke="#ffff00"
                strokeWidth="0.5"
                transform={`rotate(${ac.heading} ${x} ${y})`}
              />
              
              {/* Data tag */}
              <g>
                <rect
                  x={x + 8}
                  y={y - 15}
                  width="60"
                  height="24"
                  fill="rgba(0,0,0,0.8)"
                  stroke="#00ff00"
                  strokeWidth="0.5"
                />
                <text
                  x={x + 10}
                  y={y - 8}
                  fill="#00ff00"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {ac.callsign}
                </text>
                <text
                  x={x + 10}
                  y={y - 1}
                  fill="#00ff00"
                  fontSize="6"
                  fontFamily="monospace"
                >
                  {Math.round(ac.altitude/100)}FL {Math.round(ac.groundSpeed)}kt
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Radar controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-black/80 px-3 py-2 rounded border border-nav-green">
          <div className="text-nav-green font-mono text-sm">
            RANGE: {range} NM
          </div>
        </div>
        <div className="bg-black/80 px-3 py-2 rounded border border-nav-green">
          <div className="text-nav-green font-mono text-sm">
            AIRCRAFT: {aircraft.length}
          </div>
        </div>
      </div>

      {/* Range controls */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {[25, 50, 100, 200].map(r => (
          <Button
            key={r}
            size="sm"
            variant={range === r ? "default" : "outline"}
            onClick={() => setRange(r)}
            className="text-xs"
          >
            {r}NM
          </Button>
        ))}
      </div>
    </div>
  );
}

function PopoutRadarDisplay({ 
  aircraft, 
  onClose 
}: { 
  aircraft: EnhancedAircraft[]; 
  onClose: () => void; 
}) {
  return (
    <motion.div
      className="fixed top-20 left-20 w-[600px] h-[500px] z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
    >
      <Card className="bg-black/95 border-aviation-blue/30 shadow-2xl h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-nav-green text-lg">ATC Radar Display</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-red-500/20"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <RadarDisplay aircraft={aircraft} />
        </CardContent>
      </Card>
    </motion.div>
  );
}