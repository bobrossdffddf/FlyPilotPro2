import WebSocket from 'ws';
import { AircraftData, FlightPlan, ControllerPosition, WebSocketMessage, EnhancedAircraft } from "@shared/atc24-types";

export class ATC24Client {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private aircraftData: Map<string, EnhancedAircraft> = new Map();
  private flightPlans: Map<string, FlightPlan> = new Map();
  private controllers: ControllerPosition[] = [];
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // Connect to ATC 24 WebSocket without Origin header
      this.ws = new WebSocket('wss://24data.ptfs.app/wss', {
        headers: {}
      });

      this.ws.on('open', () => {
        console.log('Connected to ATC 24 WebSocket');
        this.isConnected = true;
        this.emit('connected');
      });

      this.ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      this.ws.on('close', () => {
        console.log('Disconnected from ATC 24 WebSocket');
        this.isConnected = false;
        this.emit('disconnected');
        
        // Reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      });
    } catch (error) {
      console.error('Failed to connect to ATC 24:', error);
      setTimeout(() => this.connect(), 10000);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.t) {
      case 'ACFT_DATA':
      case 'EVENT_ACFT_DATA':
        this.updateAircraftData(message.d as AircraftData);
        break;
      case 'FLIGHT_PLAN':
      case 'EVENT_FLIGHT_PLAN':
        this.updateFlightPlan(message.d as FlightPlan);
        break;
      case 'CONTROLLERS':
        this.updateControllers(message.d as ControllerPosition[]);
        break;
    }
  }

  private updateAircraftData(data: AircraftData) {
    const enhancedAircraft = new Map<string, EnhancedAircraft>();
    
    Object.entries(data).forEach(([callsign, aircraft]) => {
      const enhanced: EnhancedAircraft = {
        callsign,
        pilot: aircraft.playerName,
        aircraft: aircraft.aircraftType,
        altitude: aircraft.altitude,
        speed: aircraft.speed,
        groundSpeed: aircraft.groundSpeed,
        heading: aircraft.heading,
        position: aircraft.position,
        wind: aircraft.wind,
        isOnGround: aircraft.isOnGround || false,
        phase: this.determineFlightPhase(aircraft),
        flightPlan: this.flightPlans.get(callsign),
        lastUpdate: new Date()
      };

      enhancedAircraft.set(callsign, enhanced);
    });

    this.aircraftData = enhancedAircraft;
    this.emit('aircraftUpdate', Array.from(enhancedAircraft.values()));
  }

  private updateFlightPlan(flightPlan: FlightPlan) {
    this.flightPlans.set(flightPlan.callsign, flightPlan);
    
    if (this.aircraftData.has(flightPlan.callsign)) {
      const aircraft = this.aircraftData.get(flightPlan.callsign)!;
      aircraft.flightPlan = flightPlan;
      aircraft.route = `${flightPlan.departing} → ${flightPlan.arriving}`;
      this.aircraftData.set(flightPlan.callsign, aircraft);
    }

    this.emit('flightPlanUpdate', flightPlan);
  }

  private updateControllers(controllers: ControllerPosition[]) {
    this.controllers = controllers;
    this.emit('controllersUpdate', controllers);
  }

  private determineFlightPhase(aircraft: any): EnhancedAircraft['phase'] {
    if (aircraft.isOnGround) {
      return aircraft.speed > 50 ? 'takeoff' : 'taxi';
    }
    
    if (aircraft.altitude < 1000) {
      return aircraft.speed > 100 ? 'takeoff' : 'approach';
    } else if (aircraft.altitude < 3000) {
      return 'climb';
    } else if (aircraft.altitude > 30000) {
      return 'cruise';
    } else {
      return 'cruise';
    }
  }

  public getAllAircraft(): EnhancedAircraft[] {
    return Array.from(this.aircraftData.values());
  }

  public getAircraft(callsign: string): EnhancedAircraft | undefined {
    return this.aircraftData.get(callsign);
  }

  public getControllers(): ControllerPosition[] {
    return this.controllers;
  }

  public isConnectedToATC24(): boolean {
    return this.isConnected;
  }

  public on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  private emit(event: string, data?: any) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export const atc24Client = new ATC24Client();