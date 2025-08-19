import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@shared/schema";
import AnnouncementCard from "@/components/cards/announcement-card";
import AudioPlayer from "@/components/audio/audio-player";
import { FLIGHT_PHASES } from "@/lib/constants";

export default function AnnouncementsTab() {
  const [activePhase, setActivePhase] = useState("boarding");
  const [volume, setVolume] = useState(75);
  const [audioQueue, setAudioQueue] = useState<Announcement[]>([]);

  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements", activePhase],
  });

  const addToQueue = (announcement: Announcement) => {
    setAudioQueue(prev => [...prev, announcement]);
  };

  const removeFromQueue = (announcementId: string) => {
    setAudioQueue(prev => prev.filter(a => a.id !== announcementId));
  };

  const clearQueue = () => {
    setAudioQueue([]);
  };

  return (
    <div className="h-full">
      {/* Top Header */}
      <header className="bg-panel-bg border-b border-panel-gray p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary" data-testid="page-title">
              Passenger Announcements
            </h2>
            <p className="text-text-muted mt-1">Pre-recorded announcements organized by flight phase</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Volume Control */}
            <div className="flex items-center space-x-3 bg-panel-gray rounded-lg px-4 py-2">
              <i className="fas fa-volume-up text-text-secondary"></i>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-2 bg-panel-gray rounded-lg appearance-none slider"
                data-testid="volume-control"
              />
              <span className="text-sm text-text-secondary font-mono" data-testid="volume-display">
                {volume}%
              </span>
            </div>
            {/* Audio Status */}
            <div className="flex items-center space-x-2 text-nav-green">
              <div className="w-2 h-2 bg-nav-green rounded-full animate-pulse"></div>
              <span className="text-sm" data-testid="audio-status">Audio Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Flight Phase Tabs */}
      <div className="bg-panel-bg border-b border-panel-gray">
        <div className="flex overflow-x-auto px-6">
          {FLIGHT_PHASES.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activePhase === phase.id
                  ? "border-aviation-blue text-aviation-blue"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
              data-testid={`phase-${phase.id}`}
            >
              <i className={`${phase.icon} mr-2`}></i>
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-panel-bg rounded-xl border border-panel-gray p-6 animate-pulse">
                <div className="h-4 bg-panel-gray rounded mb-4"></div>
                <div className="h-3 bg-panel-gray rounded mb-2"></div>
                <div className="h-3 bg-panel-gray rounded mb-4"></div>
                <div className="h-8 bg-panel-gray rounded"></div>
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-text-muted" data-testid="empty-announcements">
            <i className="fas fa-microphone-slash text-6xl mb-4"></i>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Announcements</h3>
            <p>No announcements available for this flight phase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onAddToQueue={() => addToQueue(announcement)}
                data-testid={`announcement-${announcement.id}`}
              />
            ))}
          </div>
        )}

        {/* Audio Queue Panel */}
        <div className="bg-panel-bg rounded-xl border border-panel-gray p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary" data-testid="queue-title">
              Audio Queue
            </h3>
            <div className="flex items-center space-x-3">
              <button 
                onClick={clearQueue}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                data-testid="button-clear-queue"
              >
                <i className="fas fa-trash mr-2"></i>Clear Queue
              </button>
              <AudioPlayer 
                announcements={audioQueue} 
                volume={volume}
                onRemove={removeFromQueue}
              />
            </div>
          </div>
          {audioQueue.length === 0 ? (
            <div className="text-sm text-text-muted text-center py-8" data-testid="empty-queue">
              No announcements queued. Add announcements using the + button on any card.
            </div>
          ) : (
            <div className="space-y-2" data-testid="queue-list">
              {audioQueue.map((announcement, index) => (
                <div key={`${announcement.id}-${index}`} className="flex items-center justify-between bg-panel-gray/30 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-text-muted font-mono">{index + 1}.</span>
                    <span className="text-sm text-text-primary">{announcement.title}</span>
                    <span className="text-xs text-text-muted">{announcement.duration}</span>
                  </div>
                  <button
                    onClick={() => removeFromQueue(announcement.id)}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    data-testid={`remove-${announcement.id}`}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
