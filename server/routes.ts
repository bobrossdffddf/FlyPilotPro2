import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertAnnouncementSchema, insertChecklistSchema, insertNoteSchema, insertFlightStatusSchema, insertWeightBalanceSchema } from "@shared/schema";
import { atc24Client } from "./atc24-client";
import { EnhancedAircraft } from "@shared/atc24-types";
import { elevenLabsService } from "./elevenlabs";

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
      // Return real chart from attached assets
      const charts = [
        {
          id: "1",
          title: "IRFD Ground Chart",
          airportCode: "IRFD",
          chartType: "Ground Chart",
          fileName: "IRFD_CHART_TYPE_GROUND.svg",
          fileUrl: "/attached_assets/charts/IRFD_CHART_TYPE_GROUND.svg",
          createdAt: new Date().toISOString()
        }
          title: "EDDM Munich SID TOBAK 1F",
          airportCode: "EDDM",
          chartType: "SID Chart",
          fileName: "eddm_sid_tobak1f.pdf",
          fileUrl: "https://www.dfs.de/dfs_homepage/de/Services/Customer%20Relations/Aeronautical%20Services/Electronic%20AIP/eAIP/",
          createdAt: new Date().toISOString()
        },
        {
          id: "6",
          title: "LFPG Charles de Gaulle STAR",
          airportCode: "LFPG",
          chartType: "STAR Chart", 
          fileName: "lfpg_star_mopar.pdf",
          fileUrl: "https://www.sia.aviation-civile.gouv.fr/",
          createdAt: new Date().toISOString()
        }
      ];
      
      res.json(charts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  app.post("/api/charts", async (req, res) => {
    try {
      const { title, airportCode, chartType, fileName, fileUrl } = req.body;
      
      const newChart = {
        id: Date.now().toString(),
        title,
        airportCode,
        chartType,
        fileName,
        fileUrl,
        createdAt: new Date().toISOString()
      };
      
      res.status(201).json(newChart);
    } catch (error) {
      res.status(400).json({ message: "Invalid chart data" });
    }
  });

  app.delete("/api/charts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      res.json({ success: true, deletedId: id });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete chart" });
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

  // ElevenLabs TTS routes
  app.get("/api/voices", async (req, res) => {
    try {
      const voices = await elevenLabsService.getVoices();
      res.json(voices);
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      res.status(500).json({ message: "Failed to fetch voices from ElevenLabs" });
    }
  });

  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voice_id } = req.body;
      if (!text || !voice_id) {
        return res.status(400).json({ message: "Text and voice_id are required" });
      }

      const audioBuffer = await elevenLabsService.generateSpeech({
        text,
        voice_id,
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.1,
          use_speaker_boost: true,
        },
      });

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      });
      res.send(audioBuffer);
    } catch (error) {
      console.error('Failed to generate speech:', error);
      res.status(500).json({ message: "Failed to generate speech" });
    }
  });

  // Weight and balance routes
  app.get("/api/weight-balance/:aircraftType", async (req, res) => {
    try {
      const { aircraftType } = req.params;
      const weightData = await storage.getWeightBalance(aircraftType);
      res.json(weightData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weight and balance data" });
    }
  });

  app.post("/api/weight-balance", async (req, res) => {
    try {
      const validatedData = insertWeightBalanceSchema.parse(req.body);
      const weightData = await storage.createWeightBalance(validatedData);
      res.status(201).json(weightData);
    } catch (error) {
      res.status(400).json({ message: "Invalid weight and balance data" });
    }
  });

  // Demo aircraft data for development
  const getDemoAircraft = (): EnhancedAircraft[] => [
    {
      callsign: "UAL123",
      pilot: "Captain Smith",
      aircraft: "Boeing 737-800",
      altitude: 37000,
      groundSpeed: 480,
      speed: 480,
      heading: 95,
      latitude: 40.7128,
      longitude: -74.0060,
      phase: "cruise",
      route: "KJFK-KLAX",
      wind: "270/15",
      lastUpdate: new Date().toISOString(),
      position: { x: -74.0060, y: 40.7128 },
      isOnGround: false
    },
    {
      callsign: "DLH456",
      pilot: "Captain Mueller",
      aircraft: "Airbus A320",
      altitude: 12000,
      groundSpeed: 250,
      speed: 250,
      heading: 180,
      latitude: 52.5200,
      longitude: 13.4050,
      phase: "descent",
      route: "EDDF-EGLL",
      wind: "240/12",
      lastUpdate: new Date().toISOString(),
      position: { x: 13.4050, y: 52.5200 },
      isOnGround: false
    },
    {
      callsign: "BAW789",
      pilot: "Captain Wilson",
      aircraft: "Boeing 777-300ER",
      altitude: 2500,
      groundSpeed: 180,
      speed: 180,
      heading: 270,
      latitude: 51.4700,
      longitude: -0.4543,
      phase: "approach",
      route: "EGLL-KJFK",
      wind: "260/18",
      lastUpdate: new Date().toISOString(),
      position: { x: -0.4543, y: 51.4700 },
      isOnGround: false
    }
  ];

  // Demo mode toggle
  let forceDemo = false;
  
  app.post("/api/demo-mode", (req, res) => {
    forceDemo = req.body.enabled;
    console.log(`Demo mode ${forceDemo ? 'enabled' : 'disabled'}`);
    res.json({ demoMode: forceDemo, message: `Demo mode ${forceDemo ? 'enabled' : 'disabled'}` });
  });

  // ATC 24 Routes
  app.get("/api/aircraft", async (req, res) => {
    try {
      let aircraft = atc24Client.getAllAircraft();
      
      // If no real data available or demo mode forced, use demo data
      if (aircraft.length === 0 || forceDemo) {
        aircraft = getDemoAircraft();
      }
      
      res.json(aircraft);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch aircraft data" });
    }
  });

  app.get("/api/aircraft/:callsign", async (req, res) => {
    try {
      const { callsign } = req.params;
      const aircraft = atc24Client.getAircraft(callsign);
      if (aircraft) {
        res.json(aircraft);
      } else {
        res.status(404).json({ message: "Aircraft not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch aircraft data" });
    }
  });

  app.get("/api/controllers", async (req, res) => {
    try {
      const controllers = atc24Client.getControllers();
      res.json(controllers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch controller data" });
    }
  });

  app.get("/api/atc24/status", async (req, res) => {
    try {
      const status = {
        connected: atc24Client.isConnectedToATC24(),
        aircraftCount: atc24Client.getAllAircraft().length,
        controllersCount: atc24Client.getControllers().length,
        lastUpdate: new Date()
      };
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ATC 24 status" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');

    // Send initial data
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'aircraft',
        data: atc24Client.getAllAircraft()
      }));
    }

    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast updates to all connected clients
  function broadcastToClients(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Listen for ATC 24 updates
  atc24Client.on('aircraftUpdate', (aircraft: EnhancedAircraft[]) => {
    broadcastToClients('aircraft', aircraft);
  });

  atc24Client.on('controllersUpdate', (controllers: any) => {
    broadcastToClients('controllers', controllers);
  });

  atc24Client.on('flightPlanUpdate', (flightPlan: any) => {
    broadcastToClients('flightPlan', flightPlan);
  });

  return httpServer;
}
