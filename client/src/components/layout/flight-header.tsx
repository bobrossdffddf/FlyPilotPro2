import { motion } from "framer-motion";
import { EnhancedAircraft } from "@shared/atc24-types";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface FlightHeaderProps {
  aircraft: EnhancedAircraft;
}

export default function FlightHeader({ aircraft }: FlightHeaderProps) {
  const [, setLocation] = useLocation();

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'taxi': return 'text-caution-yellow bg-caution-yellow/20';
      case 'takeoff': return 'text-warning-orange bg-warning-orange/20';
      case 'climb': return 'text-aviation-blue bg-aviation-blue/20';
      case 'cruise': return 'text-nav-green bg-nav-green/20';
      case 'descent': return 'text-aviation-blue bg-aviation-blue/20';
      case 'approach': return 'text-warning-orange bg-warning-orange/20';
      case 'landing': return 'text-caution-yellow bg-caution-yellow/20';
      default: return 'text-text-muted bg-text-muted/20';
    }
  };

  const handleDisconnect = () => {
    sessionStorage.removeItem('selectedAircraft');
    setLocation('/');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-panel-bg border-b border-panel-gray"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Aircraft Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-aviation-blue rounded-xl flex items-center justify-center">
                <i className="fas fa-plane text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary font-mono">
                  {aircraft.callsign}
                </h1>
                <p className="text-text-secondary text-sm">{aircraft.pilot}</p>
              </div>
            </div>

            <div className="h-10 w-px bg-panel-gray"></div>

            {/* Flight Status */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted block">Aircraft</span>
                <span className="text-text-primary font-medium">{aircraft.aircraft}</span>
              </div>
              <div>
                <span className="text-text-muted block">Phase</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPhaseColor(aircraft.phase)}`}>
                  {aircraft.phase.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Flight Data Display */}
          <div className="flex items-center space-x-8">
            {/* Primary Flight Data */}
            <div className="grid grid-cols-4 gap-6 text-center bg-panel-gray/30 rounded-xl p-4">
              <div>
                <div className="text-xs text-text-muted mb-1">ALT</div>
                <div className="text-lg font-mono text-text-primary">
                  {aircraft.altitude.toLocaleString()}
                </div>
                <div className="text-xs text-text-muted">ft</div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">SPD</div>
                <div className="text-lg font-mono text-text-primary">
                  {Math.round(aircraft.groundSpeed)}
                </div>
                <div className="text-xs text-text-muted">kts</div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">HDG</div>
                <div className="text-lg font-mono text-text-primary">
                  {aircraft.heading.toString().padStart(3, '0')}
                </div>
                <div className="text-xs text-text-muted">°</div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">WIND</div>
                <div className="text-sm font-mono text-text-primary">
                  {aircraft.wind}
                </div>
                <div className="text-xs text-text-muted">°/kt</div>
              </div>
            </div>

            {/* Route Info */}
            {aircraft.route && (
              <div className="text-center">
                <div className="text-xs text-text-muted mb-1">ROUTE</div>
                <div className="text-text-primary font-medium">{aircraft.route}</div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="border-panel-gray text-text-secondary hover:text-text-primary"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Disconnect
              </Button>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-panel-gray">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-nav-green rounded-full animate-pulse"></div>
              <span className="text-text-secondary">Systems Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-aviation-blue rounded-full animate-pulse"></div>
              <span className="text-text-secondary">ATC 24 Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock text-text-muted"></i>
              <span className="text-text-secondary font-mono">
                {new Date().toLocaleTimeString()} UTC
              </span>
            </div>
          </div>

          <div className="text-xs text-text-muted">
            Last Update: {Math.floor((Date.now() - new Date(aircraft.lastUpdate).getTime()) / 1000)}s ago
          </div>
        </div>
      </div>
    </motion.header>
  );
}