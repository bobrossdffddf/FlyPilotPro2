import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedAircraft } from "@shared/atc24-types";
import { useLocation } from "wouter";

interface ATC24Status {
  connected: boolean;
  aircraftCount: number;
  controllersCount: number;
  lastUpdate: string;
}

export default function FlightSelection() {
  const [selectedAircraft, setSelectedAircraft] = useState<EnhancedAircraft | null>(null);
  const [, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Query ATC 24 status
  const { data: status } = useQuery<ATC24Status>({
    queryKey: ["/api/atc24/status"],
    refetchInterval: 5000,
  });

  // Query aircraft data
  const { data: aircraft = [], isLoading } = useQuery<EnhancedAircraft[]>({
    queryKey: ["/api/aircraft"],
    refetchInterval: 3000,
  });

  // WebSocket for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Connected to real-time updates");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'aircraft') {
        // TanStack Query will handle the update through refetch
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleAircraftSelect = async (aircraftData: EnhancedAircraft) => {
    setSelectedAircraft(aircraftData);
    setIsTransitioning(true);

    // Store selected aircraft in sessionStorage
    sessionStorage.setItem('selectedAircraft', JSON.stringify(aircraftData));

    // Cool transition animation before navigation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLocation('/dashboard');
  };

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

  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-cockpit-dark flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-aviation-blue border-t-transparent rounded-full mx-auto mb-8"
          />
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Connecting to {selectedAircraft?.callsign}
          </h2>
          <p className="text-text-secondary">Initializing flight management system...</p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="h-2 bg-aviation-blue rounded-full mt-6 max-w-md mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cockpit-dark">
      {/* Header */}
      <header className="bg-panel-bg border-b border-panel-gray p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-aviation-blue rounded-xl flex items-center justify-center">
                <i className="fas fa-plane text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">24FLY</h1>
                <p className="text-text-secondary">Professional Aviation Assistant</p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status?.connected ? 'bg-nav-green animate-pulse' : 'bg-text-muted'}`}></div>
                <span className="text-sm text-text-secondary">
                  {status?.connected ? 'ATC 24 Connected' : 'Disconnected'}
                </span>
              </div>

              {status && (
                <div className="text-sm text-text-secondary">
                  <span className="font-mono">{status.aircraftCount}</span> aircraft online
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Select Active Flight</h2>
          <p className="text-text-secondary">Choose a flight to begin assistance</p>
        </div>

        {aircraft.length === 0 ? (
          <div className="bg-panel-bg rounded-2xl border border-panel-gray p-12 text-center">
            {!status?.connected ? (
              <>
                <i className="fas fa-wifi text-6xl text-text-muted mb-6"></i>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Connecting to ATC 24</h3>
                <p className="text-text-secondary mb-6">Establishing connection to live flight data...</p>
                <div className="w-64 h-2 bg-panel-gray rounded-full mx-auto mb-4">
                  <motion.div
                    animate={{ x: [-64, 64, -64] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-2 bg-aviation-blue rounded-full"
                  />
                </div>
                <p className="text-xs text-text-muted">
                  Use demo mode console command to bypass network issues
                </p>
              </>
            ) : (
              <>
                <i className="fas fa-plane-slash text-6xl text-text-muted mb-6"></i>
                <h3 className="text-xl font-semibold text-text-primary mb-4">No Active Flights</h3>
                <p className="text-text-secondary">No aircraft currently online in ATC 24</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {aircraft.map((flight, index) => (
                <motion.div
                  key={flight.callsign}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAircraftSelect(flight)}
                  className="bg-panel-bg rounded-2xl border border-panel-gray p-6 cursor-pointer hover:shadow-cockpit transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary font-mono">
                        {flight.callsign}
                      </h3>
                      <p className="text-text-secondary text-sm">{flight.pilot}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(flight.phase)}`}>
                      {flight.phase.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-sm">Aircraft</span>
                      <span className="text-text-primary font-medium">{flight.aircraft}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-sm">Altitude</span>
                      <span className="text-text-primary font-mono">{flight.altitude.toLocaleString()} ft</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-sm">Speed</span>
                      <span className="text-text-primary font-mono">{Math.round(flight.groundSpeed)} kts</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-muted text-sm">Heading</span>
                      <span className="text-text-primary font-mono">{flight.heading.toString().padStart(3, '0')}°</span>
                    </div>
                  </div>

                  {flight.route && (
                    <div className="pt-3 border-t border-panel-gray">
                      <span className="text-text-muted text-xs">Route</span>
                      <p className="text-text-primary font-medium mt-1">{flight.route}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-text-muted text-xs">
                      Updated {Math.floor((Date.now() - new Date(flight.lastUpdate).getTime()) / 1000)}s ago
                    </span>
                    <div className="flex items-center space-x-2 text-aviation-blue">
                      <span className="text-sm font-medium">Connect</span>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}