import { 
  type Announcement, 
  type InsertAnnouncement,
  type Checklist,
  type InsertChecklist,
  type Note,
  type InsertNote,
  type Chart,
  type InsertChart,
  type Sid,
  type InsertSid,
  type FlightStatus,
  type InsertFlightStatus,
  type WeightBalance,
  type InsertWeightBalance
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByPhase(phase: string): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<boolean>;

  // Checklists
  getChecklists(): Promise<Checklist[]>;
  getChecklistById(id: string): Promise<Checklist | undefined>;
  createChecklist(checklist: InsertChecklist): Promise<Checklist>;
  updateChecklist(id: string, checklist: Partial<InsertChecklist>): Promise<Checklist>;
  deleteChecklist(id: string): Promise<boolean>;

  // Notes
  getNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: string): Promise<boolean>;

  // Charts
  getCharts(): Promise<Chart[]>;
  getChartsByAirport(airport: string): Promise<Chart[]>;
  createChart(chart: InsertChart): Promise<Chart>;
  deleteChart(id: string): Promise<boolean>;

  // SIDs
  getSids(): Promise<Sid[]>;
  getSidsByAirport(airport: string): Promise<Sid[]>;
  searchSids(query: string): Promise<Sid[]>;
  createSid(sid: InsertSid): Promise<Sid>;
  deleteSid(id: string): Promise<boolean>;

  // Flight Status
  getCurrentFlightStatus(): Promise<FlightStatus | undefined>;
  updateFlightStatus(status: InsertFlightStatus): Promise<FlightStatus>;

  // Weight and Balance
  getWeightBalance(aircraftType: string): Promise<WeightBalance | undefined>;
  createWeightBalance(weightBalance: InsertWeightBalance): Promise<WeightBalance>;
}

export class MemStorage implements IStorage {
  private announcements: Map<string, Announcement> = new Map();
  private checklists: Map<string, Checklist> = new Map();
  private notes: Map<string, Note> = new Map();
  private charts: Map<string, Chart> = new Map();
  private sids: Map<string, Sid> = new Map();
  private flightStatus: Map<string, FlightStatus> = new Map();
  private weightBalance: Map<string, WeightBalance> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with some default announcements
    const defaultAnnouncements: InsertAnnouncement[] = [
      {
        title: "Welcome Aboard",
        description: "Standard greeting",
        content: "Good morning, ladies and gentlemen, and welcome aboard American Airlines flight 1234...",
        phase: "boarding",
        duration: "1:45",
        audioUrl: null,
        icon: "fas fa-microphone",
        iconColor: "aviation-blue",
        isFavorite: false,
      },
      {
        title: "Safety Demo",
        description: "Pre-takeoff safety",
        content: "Your attention please for our safety demonstration. Please locate the nearest exit...",
        phase: "boarding",
        duration: "3:20",
        audioUrl: null,
        icon: "fas fa-shield-alt",
        iconColor: "warning-orange",
        isFavorite: true,
      },
      {
        title: "Seatbelt Sign",
        description: "Seatbelt reminder",
        content: "Ladies and gentlemen, the captain has turned on the seatbelt sign...",
        phase: "boarding",
        duration: "0:35",
        audioUrl: null,
        icon: "fas fa-user-lock",
        iconColor: "caution-yellow",
        isFavorite: false,
      },
    ];

    defaultAnnouncements.forEach(announcement => {
      this.createAnnouncement(announcement);
    });

    // Initialize with default checklists
    const defaultChecklists: InsertChecklist[] = [
      {
        title: "Pre-flight Checklist",
        phase: "preflight",
        items: [
          { id: "1", text: "Aircraft documents checked", completed: false },
          { id: "2", text: "Weather briefing completed", completed: false },
          { id: "3", text: "Flight plan filed", completed: false },
          { id: "4", text: "Aircraft inspection complete", completed: false },
        ],
        completedCount: 0,
        totalCount: 4,
      },
      {
        title: "Takeoff Checklist",
        phase: "takeoff",
        items: [
          { id: "1", text: "Controls checked", completed: true },
          { id: "2", text: "Engines at takeoff power", completed: true },
          { id: "3", text: "Runway clear", completed: true },
          { id: "4", text: "Takeoff clearance received", completed: true },
        ],
        completedCount: 4,
        totalCount: 4,
      },
      {
        title: "Landing Checklist",
        phase: "landing",
        items: [
          { id: "1", text: "Landing gear down", completed: false },
          { id: "2", text: "Flaps configured", completed: false },
          { id: "3", text: "Landing clearance received", completed: false },
          { id: "4", text: "Runway in sight", completed: false },
        ],
        completedCount: 0,
        totalCount: 4,
      },
    ];

    defaultChecklists.forEach(checklist => {
      this.createChecklist(checklist);
    });

    // Initialize with a default flight status
    this.updateFlightStatus({
      flightNumber: "AA1234",
      route: "LAX → JFK",
      aircraft: "Boeing 737-800",
      status: "ACTIVE",
      isActive: true,
    });
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async getAnnouncementsByPhase(phase: string): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).filter(a => a.phase === phase);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = {
      ...insertAnnouncement,
      id,
      createdAt: new Date(),
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, updates: Partial<InsertAnnouncement>): Promise<Announcement> {
    const existing = this.announcements.get(id);
    if (!existing) {
      throw new Error(`Announcement with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.announcements.set(id, updated);
    return updated;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    return this.announcements.delete(id);
  }

  // Checklists
  async getChecklists(): Promise<Checklist[]> {
    return Array.from(this.checklists.values());
  }

  async getChecklistById(id: string): Promise<Checklist | undefined> {
    return this.checklists.get(id);
  }

  async createChecklist(insertChecklist: InsertChecklist): Promise<Checklist> {
    const id = randomUUID();
    const checklist: Checklist = {
      ...insertChecklist,
      id,
      createdAt: new Date(),
    };
    this.checklists.set(id, checklist);
    return checklist;
  }

  async updateChecklist(id: string, updates: Partial<InsertChecklist>): Promise<Checklist> {
    const existing = this.checklists.get(id);
    if (!existing) {
      throw new Error(`Checklist with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.checklists.set(id, updated);
    return updated;
  }

  async deleteChecklist(id: string): Promise<boolean> {
    return this.checklists.delete(id);
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNoteById(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = {
      ...insertNote,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<InsertNote>): Promise<Note> {
    const existing = this.notes.get(id);
    if (!existing) {
      throw new Error(`Note with id ${id} not found`);
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Charts
  async getCharts(): Promise<Chart[]> {
    return Array.from(this.charts.values());
  }

  async getChartsByAirport(airport: string): Promise<Chart[]> {
    return Array.from(this.charts.values()).filter(c => c.airport === airport);
  }

  async createChart(insertChart: InsertChart): Promise<Chart> {
    const id = randomUUID();
    const chart: Chart = {
      ...insertChart,
      id,
      createdAt: new Date(),
    };
    this.charts.set(id, chart);
    return chart;
  }

  async deleteChart(id: string): Promise<boolean> {
    return this.charts.delete(id);
  }

  // SIDs
  async getSids(): Promise<Sid[]> {
    return Array.from(this.sids.values());
  }

  async getSidsByAirport(airport: string): Promise<Sid[]> {
    return Array.from(this.sids.values()).filter(s => s.airport === airport);
  }

  async searchSids(query: string): Promise<Sid[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.sids.values()).filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.airport.toLowerCase().includes(lowerQuery) ||
      s.runway.toLowerCase().includes(lowerQuery)
    );
  }

  async createSid(insertSid: InsertSid): Promise<Sid> {
    const id = randomUUID();
    const sid: Sid = {
      ...insertSid,
      id,
      createdAt: new Date(),
    };
    this.sids.set(id, sid);
    return sid;
  }

  async deleteSid(id: string): Promise<boolean> {
    return this.sids.delete(id);
  }

  // Flight Status
  async getCurrentFlightStatus(): Promise<FlightStatus | undefined> {
    return Array.from(this.flightStatus.values()).find(fs => fs.isActive);
  }

  async updateFlightStatus(insertStatus: InsertFlightStatus): Promise<FlightStatus> {
    // Mark all existing as inactive
    Array.from(this.flightStatus.values()).forEach(fs => {
      fs.isActive = false;
    });

    const id = randomUUID();
    const status: FlightStatus = {
      ...insertStatus,
      id,
      updatedAt: new Date(),
    };
    this.flightStatus.set(id, status);
    return status;
  }

  // Weight and Balance
  async getWeightBalance(aircraftType: string): Promise<WeightBalance | undefined> {
    return Array.from(this.weightBalance.values()).find(wb => wb.aircraftType === aircraftType);
  }

  async createWeightBalance(insertWeightBalance: InsertWeightBalance): Promise<WeightBalance> {
    const id = randomUUID();
    const weightBalance: WeightBalance = {
      ...insertWeightBalance,
      id,
      createdAt: new Date(),
    };
    this.weightBalance.set(id, weightBalance);
    return weightBalance;
  }
}

export const storage = new MemStorage();
