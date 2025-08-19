import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstrumentDisplay } from "@/components/ui/instrument-display";
import { Maximize2, Gauge, Navigation, Zap, TrendingUp } from "lucide-react";

interface PopoutInstrument {
  id: string;
  type: "attitude" | "navigation" | "speed" | "altitude";
  position: { x: number; y: number };
}

export default function InstrumentsTab() {
  const [popoutInstruments, setPopoutInstruments] = useState<PopoutInstrument[]>([]);
  
  // Mock aircraft data - in real app this would come from props or context
  const aircraftData = {
    heading: 95,
    altitude: 37000,
    groundSpeed: 480,
    pitch: 2,
    roll: -1
  };

  const instrumentTypes = [
    {
      type: "attitude" as const,
      title: "Attitude Indicator",
      description: "Artificial horizon with pitch and roll",
      icon: Gauge,
      color: "text-aviation-blue"
    },
    {
      type: "navigation" as const,
      title: "Navigation Display",
      description: "Compass rose and heading indicator",
      icon: Navigation,
      color: "text-nav-green"
    },
    {
      type: "speed" as const,
      title: "Airspeed Indicator",
      description: "Ground speed and airspeed tape",
      icon: Zap,
      color: "text-caution-yellow"
    },
    {
      type: "altitude" as const,
      title: "Altimeter",
      description: "Altitude indication and trend",
      icon: TrendingUp,
      color: "text-warning-orange"
    }
  ];

  const handlePopoutInstrument = (type: "attitude" | "navigation" | "speed" | "altitude") => {
    const newInstrument: PopoutInstrument = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 200, y: Math.random() * 200 }
    };
    setPopoutInstruments(prev => [...prev, newInstrument]);
  };

  const handleClosePopout = (id: string) => {
    setPopoutInstruments(prev => prev.filter(inst => inst.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Primary Flight Display
        </h2>
        <p className="text-text-muted">
          Click any instrument to pop it out into a separate window
        </p>
      </div>

      {/* Main Instruments Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {instrumentTypes.map((instrument) => {
            const Icon = instrument.icon;
            
            return (
              <motion.div
                key={instrument.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-panel-bg border-panel-gray hover:border-aviation-blue/30 transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-black/30 ${instrument.color}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-text-primary">
                            {instrument.title}
                          </CardTitle>
                          <p className="text-sm text-text-muted">
                            {instrument.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePopoutInstrument(instrument.type)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <div className="h-64">
                      <InstrumentDisplay 
                        type={instrument.type} 
                        aircraft={aircraftData}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Popout Instruments */}
      <AnimatePresence>
        {popoutInstruments.map((instrument) => (
          <InstrumentDisplay
            key={instrument.id}
            type={instrument.type}
            aircraft={aircraftData}
            isPopout={true}
            onClose={() => handleClosePopout(instrument.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}