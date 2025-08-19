import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface InstrumentDisplayProps {
  type: "attitude" | "navigation" | "speed" | "altitude";
  aircraft?: any;
  isPopout?: boolean;
  onTogglePopout?: () => void;
  onClose?: () => void;
}

export function InstrumentDisplay({ 
  type, 
  aircraft, 
  isPopout = false, 
  onTogglePopout, 
  onClose 
}: InstrumentDisplayProps) {
  const [isDragging, setIsDragging] = useState(false);

  const renderInstrument = () => {
    switch (type) {
      case "attitude":
        return <AttitudeIndicator aircraft={aircraft} />;
      case "navigation":
        return <NavigationDisplay aircraft={aircraft} />;
      case "speed":
        return <SpeedIndicator aircraft={aircraft} />;
      case "altitude":
        return <AltitudeIndicator aircraft={aircraft} />;
      default:
        return <div>Unknown instrument type</div>;
    }
  };

  const containerClass = isPopout 
    ? "fixed top-20 left-20 w-96 h-96 z-50 cursor-move" 
    : "w-full h-full";

  return (
    <motion.div
      className={containerClass}
      initial={isPopout ? { scale: 0.8, opacity: 0 } : false}
      animate={isPopout ? { scale: 1, opacity: 1 } : false}
      exit={isPopout ? { scale: 0.8, opacity: 0 } : false}
      drag={isPopout}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <Card className="bg-black/90 border-aviation-blue/30 shadow-2xl overflow-hidden h-full">
        {isPopout && (
          <div className="flex justify-between items-center p-2 bg-aviation-blue/10 border-b border-aviation-blue/20">
            <span className="text-text-primary text-sm font-medium capitalize">
              {type} Indicator
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePopout}
                className="h-6 w-6 p-0 hover:bg-aviation-blue/20"
              >
                {isPopout ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-red-500/20"
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        )}
        <div className="flex-1 p-4">
          {renderInstrument()}
        </div>
      </Card>
    </motion.div>
  );
}

function AttitudeIndicator({ aircraft }: { aircraft?: any }) {
  const pitch = aircraft?.pitch || 0;
  const roll = aircraft?.roll || 0;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-600 to-blue-900 rounded-full overflow-hidden">
      {/* Artificial Horizon */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-sky-400 to-orange-600"
        style={{
          transform: `rotate(${roll}deg) translateY(${pitch * 2}px)`,
        }}
      />
      
      {/* Aircraft Symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-1 bg-yellow-400 relative">
          <div className="absolute left-1/2 top-1/2 w-1 h-8 bg-yellow-400 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Pitch Scale */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-xs">
        {[-20, -10, 0, 10, 20].map(angle => (
          <div
            key={angle}
            className="absolute flex items-center"
            style={{ transform: `translateY(${-angle * 2}px)` }}
          >
            <div className="w-8 h-px bg-white mr-2" />
            <span>{angle}°</span>
            <div className="w-8 h-px bg-white ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NavigationDisplay({ aircraft }: { aircraft?: any }) {
  const heading = aircraft?.heading || 0;

  return (
    <div className="relative w-full h-full bg-black rounded-lg">
      {/* Compass Rose */}
      <div className="absolute inset-4">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#00ff00"
            strokeWidth="1"
          />
          
          {/* Heading marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <line
                x1="100"
                y1="20"
                x2="100"
                y2={angle % 90 === 0 ? "30" : "25"}
                stroke="#00ff00"
                strokeWidth={angle % 90 === 0 ? "2" : "1"}
              />
              {angle % 90 === 0 && (
                <text
                  x="100"
                  y="15"
                  textAnchor="middle"
                  fill="#00ff00"
                  fontSize="12"
                  fontFamily="monospace"
                >
                  {angle === 0 ? "N" : angle === 90 ? "E" : angle === 180 ? "S" : "W"}
                </text>
              )}
            </g>
          ))}

          {/* Aircraft heading indicator */}
          <g transform={`rotate(${heading} 100 100)`}>
            <polygon
              points="100,25 105,35 95,35"
              fill="#ffff00"
              stroke="#ffff00"
            />
          </g>

          {/* Center dot */}
          <circle cx="100" cy="100" r="2" fill="#00ff00" />
        </svg>
      </div>

      {/* Heading digital display */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/80 px-3 py-1 rounded border border-aviation-blue">
          <span className="text-nav-green font-mono text-lg">
            {Math.round(heading).toString().padStart(3, '0')}°
          </span>
        </div>
      </div>
    </div>
  );
}

function SpeedIndicator({ aircraft }: { aircraft?: any }) {
  const speed = aircraft?.groundSpeed || 0;

  return (
    <div className="relative w-full h-full bg-black rounded-lg p-4">
      <div className="h-full flex flex-col justify-between">
        {/* Speed tape */}
        <div className="flex-1 relative">
          <div className="absolute left-0 top-0 w-full h-full">
            {Array.from({ length: 21 }, (_, i) => {
              const speedValue = Math.floor(speed / 10) * 10 + (i - 10) * 10;
              const yPos = 50 + (i - 10) * 20;
              
              if (speedValue < 0) return null;
              
              return (
                <div
                  key={i}
                  className="absolute left-0 flex items-center"
                  style={{ top: `${yPos}%`, transform: 'translateY(-50%)' }}
                >
                  <div className="w-8 h-px bg-nav-green mr-2" />
                  <span className="text-nav-green font-mono text-sm">
                    {speedValue}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Current speed indicator */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="bg-nav-green text-black px-2 py-1 rounded font-mono font-bold">
              {Math.round(speed)}
            </div>
          </div>
        </div>

        <div className="text-center text-text-muted text-xs mt-2">
          GROUND SPEED
        </div>
      </div>
    </div>
  );
}

function AltitudeIndicator({ aircraft }: { aircraft?: any }) {
  const altitude = aircraft?.altitude || 0;

  return (
    <div className="relative w-full h-full bg-black rounded-lg p-4">
      <div className="h-full flex flex-col justify-between">
        {/* Altitude tape */}
        <div className="flex-1 relative">
          <div className="absolute right-0 top-0 w-full h-full">
            {Array.from({ length: 21 }, (_, i) => {
              const altValue = Math.floor(altitude / 1000) * 1000 + (i - 10) * 1000;
              const yPos = 50 + (i - 10) * 20;
              
              if (altValue < 0) return null;
              
              return (
                <div
                  key={i}
                  className="absolute right-0 flex items-center justify-end"
                  style={{ top: `${yPos}%`, transform: 'translateY(-50%)' }}
                >
                  <span className="text-nav-green font-mono text-sm mr-2">
                    {altValue.toLocaleString()}
                  </span>
                  <div className="w-8 h-px bg-nav-green" />
                </div>
              );
            })}
          </div>
          
          {/* Current altitude indicator */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <div className="bg-nav-green text-black px-2 py-1 rounded font-mono font-bold">
              {altitude.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="text-center text-text-muted text-xs mt-2">
          ALTITUDE (FT)
        </div>
      </div>
    </div>
  );
}