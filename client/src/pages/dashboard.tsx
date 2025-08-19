import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import AnnouncementsTab from "@/components/tabs/announcements-tab";
import ChartsTab from "@/components/tabs/charts-tab";
import SidsTab from "@/components/tabs/sids-tab";
import NotepadTab from "@/components/tabs/notepad-tab";
import ChecklistsTab from "@/components/tabs/checklists-tab";

type TabType = "announcements" | "charts" | "sids" | "notepad" | "checklists";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("announcements");

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
      default:
        return <AnnouncementsTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cockpit-dark">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        {renderActiveTab()}
      </main>
    </div>
  );
}
