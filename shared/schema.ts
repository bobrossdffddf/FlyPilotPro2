import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ATC 24 Data Types
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

export interface Position {
  holder: string | null;
  claimable: boolean;
  airport: string;
  position: string;
  queue: string[];
}

export interface WebSocketMessage {
  t: "ACFT_DATA" | "EVENT_ACFT_DATA" | "FLIGHT_PLAN" | "EVENT_FLIGHT_PLAN" | "CONTROLLERS";
  d: AircraftData | FlightPlan | Position[];
}

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  phase: text("phase").notNull(), // boarding, taxi, takeoff, cruise, descent, landing
  duration: text("duration").notNull(),
  audioUrl: text("audio_url"),
  icon: text("icon").notNull(),
  iconColor: text("icon_color").notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const checklists = pgTable("checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  phase: text("phase").notNull(), // preflight, takeoff, cruise, landing, emergency
  items: jsonb("items").notNull().$type<Array<{ id: string; text: string; completed: boolean; }>>(),
  completedCount: integer("completed_count").default(0),
  totalCount: integer("total_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  flightNumber: text("flight_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const sids = pgTable("sids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  airport: text("airport").notNull(),
  runway: text("runway").notNull(),
  description: text("description").notNull(),
  procedure: jsonb("procedure").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flightStatus = pgTable("flight_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightNumber: text("flight_number").notNull(),
  route: text("route").notNull(),
  aircraft: text("aircraft").notNull(),
  status: text("status").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export const insertChecklistSchema = createInsertSchema(checklists).omit({
  id: true,
  createdAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});


export const insertSidSchema = createInsertSchema(sids).omit({
  id: true,
  createdAt: true,
});

export const insertFlightStatusSchema = createInsertSchema(flightStatus).omit({
  id: true,
  updatedAt: true,
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertChecklist = z.infer<typeof insertChecklistSchema>;
export type Checklist = typeof checklists.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;


export type InsertSid = z.infer<typeof insertSidSchema>;
export type Sid = typeof sids.$inferSelect;

export type InsertFlightStatus = z.infer<typeof insertFlightStatusSchema>;
export type FlightStatus = typeof flightStatus.$inferSelect;

// Aircraft definitions for checklists and weight calculations
export const aircraftTypes = [
  "ATR-72",
  "Boeing 727",
  "Boeing 737",
  "Boeing 747",
  "Boeing 757",
  "Boeing 767",
  "Boeing 777",
  "Boeing 787",
  "Airbus A220",
  "Airbus A320",
  "Airbus A330",
  "Airbus A340",
  "Airbus A350",
  "Airbus A380",
  "Concorde",
  "Cessna 172",
  "Cessna 182",
  "Cessna 402",
  "Cessna Caravan",
  "Cessna Caravan (Skydiving)",
  "Cirrus Vision SF50",
  "DHC-6 Twin Otter",
  "Bombardier Learjet",
  "Extra 300s",
  "Piper PA-28",
  "Piper Cub"
] as const;

export type AircraftType = typeof aircraftTypes[number];

// Weight and balance data structure
export const weightBalance = pgTable("weight_balance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  aircraftType: text("aircraft_type").notNull(),
  maxTakeoffWeight: real("max_takeoff_weight").notNull(),
  maxLandingWeight: real("max_landing_weight").notNull(),
  emptyWeight: real("empty_weight").notNull(),
  maxFuelCapacity: real("max_fuel_capacity").notNull(),
  maxPassengers: integer("max_passengers").notNull(),
  avgPassengerWeight: real("avg_passenger_weight").default(170).notNull(),
  cargoBayCapacity: real("cargo_bay_capacity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeightBalanceSchema = createInsertSchema(weightBalance).omit({
  id: true,
  createdAt: true,
});

export type InsertWeightBalance = z.infer<typeof insertWeightBalanceSchema>;
export type WeightBalance = typeof weightBalance.$inferSelect;
