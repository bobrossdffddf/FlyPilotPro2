import { useState } from "react";
import { Radar, Settings } from "lucide-react";
import { EnhancedAircraft } from "@shared/atc24-types";
import NDDisplay from "@/components/navigation-display/nd-display";
import NDControls from "@/components/navigation-display/nd-controls";

interface InstrumentsTabProps {
  selectedAircraft: EnhancedAircraft | null;
}

export default function InstrumentsTab({ selectedAircraft }: InstrumentsTabProps) {
  const [ndRange, setNdRange] = useState(8);
  const [ndMode, setNdMode] = useState<"NAV" | "ILS" | "VOR" | "ARC">("NAV");
  const [showWeather, setShowWeather] = useState(false);
  const [showTerrain, setShowTerrain] = useState(true);
  const [mapOverlay, setMapOverlay] = useState<string | undefined>();
  const [showControls, setShowControls] = useState(false);

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
                Navigation Display
                <span className="ml-2 px-2 py-1 text-xs bg-nav-green/20 text-nav-green rounded-lg">
                  LIVE
                </span>
              </h2>
              <p className="text-text-muted">
                Real-time radar and navigation instruments
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-2 px-4 py-2 bg-panel-bg border border-panel-gray rounded-lg text-text-primary hover:bg-panel-gray/30 transition-colors"
            data-testid="button-toggle-controls"
          >
            <Settings size={18} />
            {showControls ? 'Hide Controls' : 'Show Controls'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Navigation Display */}
        <div className="flex-1 flex items-center justify-center">
          <NDDisplay
            selectedAircraft={selectedAircraft}
            range={ndRange}
            mode={ndMode}
            showWeather={showWeather}
            showTerrain={showTerrain}
            mapOverlay={mapOverlay}
          />
        </div>

        {/* Controls Panel */}
        {showControls && (
          <div className="w-80 flex-shrink-0">
            <NDControls
              range={ndRange}
              mode={ndMode}
              showWeather={showWeather}
              showTerrain={showTerrain}
              mapOverlay={mapOverlay}
              onRangeChange={setNdRange}
              onModeChange={setNdMode}
              onWeatherToggle={setShowWeather}
              onTerrainToggle={setShowTerrain}
              onMapOverlayChange={setMapOverlay}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-panel-gray px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-nav-green rounded-full animate-pulse"></div>
              <span className="text-text-secondary">ND System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-aviation-blue rounded-full animate-pulse"></div>
              <span className="text-text-secondary">Real-time Data Active</span>
            </div>
            {mapOverlay && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning-orange rounded-full"></div>
                <span className="text-text-secondary">Terrain Overlay</span>
              </div>
            )}
          </div>
          
          <div className="text-text-muted font-mono">
            Range: {ndRange}NM • Mode: {ndMode}
          </div>
        </div>
      </div>
    </div>
  );
}