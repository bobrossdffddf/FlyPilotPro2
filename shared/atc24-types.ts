// ATC 24 API Data Types
export interface AircraftData {
  [callsign: string]: {
    heading: number;
    playerName: string;
    altitude: number;
    aircraftType: string;
    position: {
      y: number;
      x: number;
    };
    speed: number;
    wind: string;
    isOnGround?: boolean;
    groundSpeed: number;
  };
}

export interface FlightPlan {
  robloxName: string;
  callsign: string;
  realcallsign: string;
  aircraft: string;
  flightrules: string;
  departing: string;
  arriving: string;
  route: string;
  flightlevel: string;
}

export interface ControllerPosition {
  holder: string | null;
  claimable: boolean;
  airport: string;
  position: string;
  queue: string[];
}

export interface WebSocketMessage {
  t: "ACFT_DATA" | "EVENT_ACFT_DATA" | "FLIGHT_PLAN" | "EVENT_FLIGHT_PLAN" | "CONTROLLERS";
  d: AircraftData | FlightPlan | ControllerPosition[];
}

// Extended types for our app
export interface EnhancedAircraft {
  callsign: string;
  pilot: string;
  aircraft: string;
  altitude: number;
  speed: number;
  groundSpeed: number;
  heading: number;
  position: { x: number; y: number };
  wind: string;
  isOnGround: boolean;
  phase: "taxi" | "takeoff" | "climb" | "cruise" | "descent" | "approach" | "landing";
  route?: string;
  flightPlan?: FlightPlan;
  estimatedDuration?: number;
  lastUpdate: Date;
}