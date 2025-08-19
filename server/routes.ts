import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnnouncementSchema, insertChecklistSchema, insertNoteSchema, insertFlightStatusSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Announcements routes
  app.get("/api/announcements", async (req, res) => {
    try {
      const { phase } = req.query;
      const announcements = phase 
        ? await storage.getAnnouncementsByPhase(phase as string)
        : await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Invalid announcement data" });
    }
  });

  app.patch("/api/announcements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const announcement = await storage.updateAnnouncement(id, updates);
      res.json(announcement);
    } catch (error) {
      res.status(404).json({ message: "Announcement not found" });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAnnouncement(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Announcement not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete announcement" });
    }
  });

  // Checklists routes
  app.get("/api/checklists", async (req, res) => {
    try {
      const checklists = await storage.getChecklists();
      res.json(checklists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch checklists" });
    }
  });

  app.get("/api/checklists/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const checklist = await storage.getChecklistById(id);
      if (checklist) {
        res.json(checklist);
      } else {
        res.status(404).json({ message: "Checklist not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch checklist" });
    }
  });

  app.post("/api/checklists", async (req, res) => {
    try {
      const validatedData = insertChecklistSchema.parse(req.body);
      const checklist = await storage.createChecklist(validatedData);
      res.status(201).json(checklist);
    } catch (error) {
      res.status(400).json({ message: "Invalid checklist data" });
    }
  });

  app.patch("/api/checklists/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const checklist = await storage.updateChecklist(id, updates);
      res.json(checklist);
    } catch (error) {
      res.status(404).json({ message: "Checklist not found" });
    }
  });

  app.delete("/api/checklists/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteChecklist(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Checklist not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete checklist" });
    }
  });

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const note = await storage.getNoteById(id);
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const note = await storage.updateNote(id, updates);
      res.json(note);
    } catch (error) {
      res.status(404).json({ message: "Note not found" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteNote(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Charts routes
  app.get("/api/charts", async (req, res) => {
    try {
      const { airport } = req.query;
      const charts = airport 
        ? await storage.getChartsByAirport(airport as string)
        : await storage.getCharts();
      res.json(charts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  // SIDs routes
  app.get("/api/sids", async (req, res) => {
    try {
      const { airport, search } = req.query;
      let sids;
      if (search) {
        sids = await storage.searchSids(search as string);
      } else if (airport) {
        sids = await storage.getSidsByAirport(airport as string);
      } else {
        sids = await storage.getSids();
      }
      res.json(sids);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SIDs" });
    }
  });

  // Flight Status routes
  app.get("/api/flight-status", async (req, res) => {
    try {
      const status = await storage.getCurrentFlightStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight status" });
    }
  });

  app.put("/api/flight-status", async (req, res) => {
    try {
      const validatedData = insertFlightStatusSchema.parse(req.body);
      const status = await storage.updateFlightStatus(validatedData);
      res.json(status);
    } catch (error) {
      res.status(400).json({ message: "Invalid flight status data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
