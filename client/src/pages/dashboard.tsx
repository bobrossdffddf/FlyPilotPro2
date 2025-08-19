import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { EnhancedAircraft } from "@shared/atc24-types";
import { TabsHeader } from "@/components/ui/tabs-header";
import EnhancedAnnouncementsTab from "@/components/tabs/enhanced-announcements-tab";
import EnhancedChartsTab from "@/components/tabs/enhanced-charts-tab";
import SidsTab from "@/components/tabs/sids-tab";
import NotepadTab from "@/components/tabs/notepad-tab";
import EnhancedChecklistsTab from "@/components/tabs/enhanced-checklists-tab";
import EnhancedWeightBalanceTab from "@/components/tabs/enhanced-weight-balance-tab";
import InstrumentsTab from "@/components/tabs/instruments-tab";
import FlightHeader from "@/components/layout/flight-header";

type TabType = "announcements" | "charts" | "sids" | "notepad" | "checklists" | "weight" | "instruments";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("announcements");
  const [selectedAircraft, setSelectedAircraft] = useState<EnhancedAircraft | null>(null);
  const [, setLocation] = useLocation();

  // Check for selected aircraft from flight selection
  useEffect(() => {
    const stored = sessionStorage.getItem('selectedAircraft');
    if (stored) {
      try {
        const aircraft = JSON.parse(stored);
        setSelectedAircraft(aircraft);
      } catch (error) {
        console.error('Failed to parse selected aircraft:', error);
        // Create a default aircraft for testing
        const defaultAircraft = {
          callsign: "UAL123",
          pilot: "Captain Smith",
          aircraft: "Boeing 737-800",
          departure: "KJFK",
          arrival: "KLAX",
          altitude: 37000,
          groundSpeed: 480,
          heading: 270,
          latitude: 40.6413,
          longitude: -74.1793
        };
        setSelectedAircraft(defaultAircraft);
        sessionStorage.setItem('selectedAircraft', JSON.stringify(defaultAircraft));
      }
    } else {
      // Create a default aircraft for testing
      const defaultAircraft = {
        callsign: "UAL123",
        pilot: "Captain Smith",
        aircraft: "Boeing 737-800",
        departure: "KJFK",
        arrival: "KLAX",
        altitude: 37000,
        groundSpeed: 480,
        heading: 270,
        latitude: 40.6413,
        longitude: -74.1793
      };
      setSelectedAircraft(defaultAircraft);
      sessionStorage.setItem('selectedAircraft', JSON.stringify(defaultAircraft));
    }
  }, [setLocation]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "announcements":
        return <EnhancedAnnouncementsTab />;
      case "charts":
        return <EnhancedChartsTab />;
      case "sids":
        return <SidsTab />;
      case "notepad":
        return <NotepadTab />;
      case "checklists":
        return <EnhancedChecklistsTab />;
      case "weight":
        return <EnhancedWeightBalanceTab />;
      case "instruments":
        return <InstrumentsTab />;
      default:
        return <EnhancedAnnouncementsTab />;
    }
  };

  if (!selectedAircraft) {
    return (
      <div className="min-h-screen bg-cockpit-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-aviation-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-cockpit-dark"
    >
      <FlightHeader aircraft={selectedAircraft} />
      <TabsHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderActiveTab()}
        </motion.div>
      </main>
    </motion.div>
  );
}
