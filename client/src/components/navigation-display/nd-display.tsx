import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { EnhancedAircraft } from "@shared/atc24-types";

interface NDDisplayProps {
  selectedAircraft: EnhancedAircraft | null;
  range: number; // Nautical miles
  mode: "NAV" | "ILS" | "VOR" | "ARC";
  showWeather: boolean;
  showTerrain: boolean;
  mapOverlay?: string;
}

interface AircraftSymbol {
  callsign: string;
  x: number;
  y: number;
  heading: number;
  altitude: number;
  isSelected: boolean;
  phase: string;
}

export default function NDDisplay({
  selectedAircraft,
  range = 40,
  mode = "NAV",
  showWeather,
  showTerrain,
  mapOverlay
}: NDDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aircraftSymbols, setAircraftSymbols] = useState<AircraftSymbol[]>([]);
  const [centerPosition, setCenterPosition] = useState({ x: 0, y: 0 });
  
  // Fetch all aircraft for radar display
  const { data: allAircraft = [] } = useQuery<EnhancedAircraft[]>({
    queryKey: ["/api/aircraft"],
    refetchInterval: 1000, // Update every second for smooth radar
  });

  // Convert ATC 24 coordinates to ND display coordinates
  const convertToNDCoordinates = useCallback((aircraft: EnhancedAircraft, center: { x: number; y: number }) => {
    if (!selectedAircraft) return { x: 0, y: 0 };

    // Convert studs to nautical miles (3307.14286 studs = 1 NMi)
    const STUDS_PER_NMI = 3307.14286;
    
    // Calculate relative position from selected aircraft
    const relativeX = (aircraft.position.x - center.x) / STUDS_PER_NMI;
    const relativeY = (aircraft.position.y - center.y) / STUDS_PER_NMI;
    
    // Convert to screen coordinates (ND is 800x800px, range is in NMi)
    const scale = 400 / range; // pixels per nautical mile
    
    // In ATC 24: -y is North, -x is West
    // In ND display: +y is up (North), +x is right (East)
    const screenX = 400 - (relativeX * scale); // Center + convert West-negative to East-positive
    const screenY = 400 + (relativeY * scale); // Center + convert North-negative to South-positive
    
    return { x: screenX, y: screenY };
  }, [range, selectedAircraft]);

  // Update aircraft symbols when data changes
  useEffect(() => {
    if (!selectedAircraft || !allAircraft.length) return;

    const center = selectedAircraft.position;
    setCenterPosition(center);

    const symbols: AircraftSymbol[] = allAircraft
      .filter(aircraft => {
        // Calculate distance from center aircraft
        const relativeX = (aircraft.position.x - center.x) / 3307.14286;
        const relativeY = (aircraft.position.y - center.y) / 3307.14286;
        const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
        return distance <= range; // Only show aircraft within range
      })
      .map(aircraft => {
        const pos = convertToNDCoordinates(aircraft, center);
        return {
          callsign: aircraft.callsign,
          x: pos.x,
          y: pos.y,
          heading: aircraft.heading,
          altitude: aircraft.altitude,
          isSelected: aircraft.callsign === selectedAircraft.callsign,
          phase: aircraft.phase
        };
      });

    setAircraftSymbols(symbols);
  }, [allAircraft, selectedAircraft, range, convertToNDCoordinates]);

  // Draw the ND display
  const drawND = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedAircraft) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0f1c';
    ctx.fillRect(0, 0, 800, 800);

    // Set up drawing context
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw map underlay if provided
    if (mapOverlay && showTerrain) {
      // Placeholder for map overlay - user can replace this
      ctx.fillStyle = 'rgba(101, 67, 33, 0.3)'; // Brown terrain color
      ctx.fillRect(100, 100, 600, 600);
      
      // Add text indicator for map overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('TERRAIN MAP OVERLAY', 400, 50);
      ctx.fillText('(Replace with your terrain data)', 400, 70);
    }

    // Draw range rings
    const centerX = 400;
    const centerY = 400;
    const ringSpacing = 400 / range * 10; // 10 NMi rings

    ctx.strokeStyle = 'rgba(0, 255, 187, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= range / 10; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, i * ringSpacing, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Range labels
      ctx.fillStyle = 'rgba(0, 255, 187, 0.7)';
      ctx.font = '12px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`${i * 10}`, centerX + i * ringSpacing - 5, centerY - 5);
    }

    // Draw compass rose
    ctx.strokeStyle = 'rgba(0, 255, 187, 0.8)';
    ctx.lineWidth = 2;
    
    // Cardinal directions
    const directions = [
      { angle: 0, label: 'N' },
      { angle: 90, label: 'E' },
      { angle: 180, label: 'S' },
      { angle: 270, label: 'W' }
    ];

    directions.forEach(dir => {
      const angle = (dir.angle - 90) * Math.PI / 180; // Convert to radians, adjust for 0° = North
      const x1 = centerX + Math.cos(angle) * 350;
      const y1 = centerY + Math.sin(angle) * 350;
      const x2 = centerX + Math.cos(angle) * 370;
      const y2 = centerY + Math.sin(angle) * 370;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Direction labels
      ctx.fillStyle = 'rgba(0, 255, 187, 1)';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      const labelX = centerX + Math.cos(angle) * 385;
      const labelY = centerY + Math.sin(angle) * 385 + 5;
      ctx.fillText(dir.label, labelX, labelY);
    });

    // Draw aircraft symbols
    aircraftSymbols.forEach(aircraft => {
      drawAircraftSymbol(ctx, aircraft);
    });

    // Draw heading line for selected aircraft
    if (selectedAircraft) {
      const headingAngle = (selectedAircraft.heading - 90) * Math.PI / 180;
      ctx.strokeStyle = '#00ffbb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(headingAngle) * 100,
        centerY + Math.sin(headingAngle) * 100
      );
      ctx.stroke();
    }

    // Draw wind arrow
    if (selectedAircraft?.wind) {
      drawWindArrow(ctx, selectedAircraft.wind);
    }

  }, [aircraftSymbols, selectedAircraft, range, showTerrain, mapOverlay]);

  const drawAircraftSymbol = (ctx: CanvasRenderingContext2D, aircraft: AircraftSymbol) => {
    const { x, y, heading, isSelected, phase } = aircraft;
    
    // Skip if outside visible area
    if (x < 0 || x > 800 || y < 0 || y > 800) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((heading - 90) * Math.PI / 180); // Convert to radians

    // Aircraft symbol color based on phase and selection
    let color = '#00bbff'; // Default blue
    if (isSelected) color = '#00ff00'; // Green for selected
    else if (phase === 'cruise') color = '#00bbff';
    else if (phase === 'climb' || phase === 'descent') color = '#ffaa00';
    else if (phase === 'approach' || phase === 'landing') color = '#ff6600';
    else if (phase === 'taxi' || phase === 'takeoff') color = '#ffff00';

    // Draw aircraft triangle
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = isSelected ? 3 : 2;
    
    ctx.beginPath();
    ctx.moveTo(0, -12); // Nose
    ctx.lineTo(-8, 8);  // Left wing
    ctx.lineTo(0, 4);   // Tail
    ctx.lineTo(8, 8);   // Right wing
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Draw callsign and altitude
    ctx.fillStyle = color;
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(aircraft.callsign, x, y + 25);
    ctx.fillText(`${Math.round(aircraft.altitude / 100)}`, x, y + 38);
  };

  const drawWindArrow = (ctx: CanvasRenderingContext2D, windData: string) => {
    // Parse wind data (format: "270@15" = 270 degrees at 15 knots)
    const [direction, speed] = windData.split('@').map(Number);
    if (!direction || !speed) return;

    const x = 700; // Top right corner
    const y = 100;
    
    ctx.save();
    ctx.translate(x, y);
    
    // Wind direction arrow (from where wind is coming)
    const windAngle = (direction - 90) * Math.PI / 180;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const endX = Math.cos(windAngle) * 30;
    const endY = Math.sin(windAngle) * 30;
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - Math.cos(windAngle - 0.5) * 8, endY - Math.sin(windAngle - 0.5) * 8);
    ctx.lineTo(endX - Math.cos(windAngle + 0.5) * 8, endY - Math.sin(windAngle + 0.5) * 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
    
    // Wind data text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`${direction.toString().padStart(3, '0')}°`, x, y + 50);
    ctx.fillText(`${speed}KT`, x, y + 65);
  };

  // Redraw when dependencies change
  useEffect(() => {
    drawND();
  }, [drawND]);

  return (
    <div className="relative">
      {/* ND Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="border-2 border-panel-gray rounded-lg bg-cockpit-dark"
        data-testid="nd-canvas"
      />
      
      {/* Mode and Range Display */}
      <div className="absolute top-4 left-4 bg-panel-bg/90 rounded-lg p-3 border border-panel-gray">
        <div className="text-aviation-blue font-mono text-lg font-bold">{mode}</div>
        <div className="text-text-primary font-mono text-sm">{range} NM</div>
      </div>
      
      {/* Selected Aircraft Info */}
      {selectedAircraft && (
        <div className="absolute top-4 right-4 bg-panel-bg/90 rounded-lg p-3 border border-panel-gray min-w-48">
          <div className="text-nav-green font-mono text-sm font-bold">{selectedAircraft.callsign}</div>
          <div className="text-text-primary font-mono text-xs space-y-1">
            <div>HDG: {selectedAircraft.heading.toString().padStart(3, '0')}°</div>
            <div>ALT: {selectedAircraft.altitude.toLocaleString()} ft</div>
            <div>SPD: {Math.round(selectedAircraft.groundSpeed)} kts</div>
            <div>WIND: {selectedAircraft.wind}</div>
          </div>
        </div>
      )}
      
      {/* Map Overlay Indicator */}
      {mapOverlay && (
        <div className="absolute bottom-4 left-4 bg-panel-bg/90 rounded-lg p-2 border border-panel-gray">
          <div className="text-warning-orange font-mono text-xs">TERRAIN</div>
          <div className="text-text-muted font-mono text-xs">MAP LOADED</div>
        </div>
      )}
    </div>
  );
}