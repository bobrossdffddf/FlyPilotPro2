import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { EnhancedAircraft } from "@shared/atc24-types";
import Sidebar from "@/components/layout/sidebar";
import AnnouncementsTab from "@/components/tabs/announcements-tab";
import ChartsTab from "@/components/tabs/charts-tab";
import SidsTab from "@/components/tabs/sids-tab";
import NotepadTab from "@/components/tabs/notepad-tab";
import ChecklistsTab from "@/components/tabs/checklists-tab";
import WeightBalanceTab from "@/components/tabs/weight-balance-tab";
import VirtualMicTab from "@/components/tabs/virtual-mic-tab";
import FlightHeader from "@/components/layout/flight-header";

type TabType = "announcements" | "charts" | "sids" | "notepad" | "checklists" | "weight" | "virtuemic";

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
        setLocation('/');
      }
    } else {
      // No aircraft selected, redirect to flight selection
      setLocation('/');
    }
  }, [setLocation]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "announcements":
        return <AnnouncementsTab />;
      case "charts":
        return <ChartsTab />;
      case "sids":
        return <SidsTab />;
      case "notepad":
        return <NotepadTab />;
      case "checklists":
        return <ChecklistsTab />;
      case "weight":
        return <WeightBalanceTab />;
      case "virtuemic":
        return <VirtualMicTab />;
      default:
        return <AnnouncementsTab />;
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
      <div className="flex-1 flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          selectedAircraft={selectedAircraft}
        />
        <main className="flex-1 overflow-hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveTab()}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}
