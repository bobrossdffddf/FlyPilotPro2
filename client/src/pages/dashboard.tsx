import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { EnhancedAircraft } from "@shared/atc24-types";
import { TabsHeader } from "@/components/ui/tabs-header";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import EnhancedAnnouncementsTab from "@/components/tabs/enhanced-announcements-tab";
import SidsTab from "@/components/tabs/sids-tab";
import NotepadTab from "@/components/tabs/notepad-tab";
import EnhancedChecklistsTab from "@/components/tabs/enhanced-checklists-tab";
import EnhancedWeightBalanceTab from "@/components/tabs/enhanced-weight-balance-tab";
import InstrumentsTab from "@/components/tabs/instruments-tab";
import HelpTab from "@/components/tabs/help-tab"; // Assuming HelpTab is in this path
import FlightHeader from "@/components/layout/flight-header";

type TabType = "announcements" | "sids" | "notepad" | "checklists" | "weight" | "instruments" | "help";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("announcements");
  const [selectedAircraft, setSelectedAircraft] = useState<EnhancedAircraft | null>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(true);
  const [, setLocation] = useLocation();
  const params = useParams<{ callsign?: string }>();

  // Get all aircraft data for real-time updates
  const { data: allAircraft = [] } = useQuery<EnhancedAircraft[]>({
    queryKey: ["/api/aircraft"],
    refetchInterval: 3000,
  });

  // Set selected aircraft based on URL parameter or default
  useEffect(() => {
    if (params.callsign && allAircraft.length > 0) {
      // Find the selected aircraft by callsign
      const aircraft = allAircraft.find(a => a.callsign === decodeURIComponent(params.callsign!));
      if (aircraft) {
        setSelectedAircraft(aircraft);
      } else {
        // Aircraft not found, redirect to flight selection
        setLocation('/');
      }
    } else if (!params.callsign && allAircraft.length > 0) {
      // No callsign in URL, use first available aircraft or redirect to selection
      setLocation('/');
    }
  }, [params.callsign, allAircraft, setLocation]);

  // Update selected aircraft with real-time data
  useEffect(() => {
    if (selectedAircraft && allAircraft.length > 0) {
      const updated = allAircraft.find(a => a.callsign === selectedAircraft.callsign);
      if (updated) {
        setSelectedAircraft(updated);
      }
    }
  }, [allAircraft, selectedAircraft]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "announcements":
        return <EnhancedAnnouncementsTab selectedAircraft={selectedAircraft} />;
      case "sids":
        return <SidsTab />;
      case "notepad":
        return <NotepadTab />;
      case "checklists":
        return <EnhancedChecklistsTab />;
      case "weight":
        return <EnhancedWeightBalanceTab />;
      case "instruments":
        return <InstrumentsTab selectedAircraft={selectedAircraft} />;
      case "help":
        return <HelpTab />;
      default:
        return <EnhancedAnnouncementsTab selectedAircraft={selectedAircraft} />;
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
      
      {/* TTS Service Notice Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="sm:max-w-md bg-panel-bg border-panel-gray">
          <DialogHeader>
            <DialogTitle className="text-text-primary flex items-center gap-2">
              <Info className="h-5 w-5 text-aviation-blue" />
              Flight Management System
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Aviation announcement information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-aviation-blue/20 bg-aviation-blue/10">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-text-primary">
                Professional aviation announcements use a 3rd party text-to-speech service for natural voice synthesis. 
                <strong className="text-aviation-blue"> No login or registration is required</strong> - the service is completely free and anonymous.
              </AlertDescription>
            </Alert>
            <div className="text-sm text-text-muted space-y-2">
              <p>• High-quality AI voices in multiple languages</p>
              <p>• Professional aviation terminology</p>
              <p>• No data collection or account needed</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowAnnouncementDialog(false)}
              className="bg-aviation-blue hover:bg-aviation-blue/80"
            >
              Continue to Flight Deck
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}