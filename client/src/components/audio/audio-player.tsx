import { useState } from "react";
import { Announcement } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface AudioPlayerProps {
  announcements: Announcement[];
  volume: number;
  onRemove: (id: string) => void;
}

export default function AudioPlayer({ announcements, volume, onRemove }: AudioPlayerProps) {
  const {
    isPlaying,
    currentIndex,
    play,
    pause,
    stop,
    next,
    previous,
  } = useAudioPlayer(announcements, volume);

  const currentAnnouncement = announcements[currentIndex];

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {announcements.length > 1 && (
        <Button
          onClick={previous}
          variant="outline"
          size="sm"
          disabled={currentIndex === 0}
          className="border-panel-gray text-text-secondary hover:text-text-primary"
          data-testid="button-previous"
        >
          <i className="fas fa-step-backward"></i>
        </Button>
      )}
      
      <Button
        onClick={isPlaying ? pause : play}
        className="bg-nav-green hover:bg-nav-green/80 text-cockpit-dark"
        data-testid="button-play-all"
      >
        <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"} mr-2`}></i>
        {isPlaying ? "Pause" : "Play All"}
      </Button>

      {announcements.length > 1 && (
        <Button
          onClick={next}
          variant="outline"
          size="sm"
          disabled={currentIndex === announcements.length - 1}
          className="border-panel-gray text-text-secondary hover:text-text-primary"
          data-testid="button-next"
        >
          <i className="fas fa-step-forward"></i>
        </Button>
      )}

      {isPlaying && (
        <Button
          onClick={stop}
          variant="outline"
          size="sm"
          className="border-panel-gray text-warning-orange hover:text-warning-orange/80"
          data-testid="button-stop"
        >
          <i className="fas fa-stop"></i>
        </Button>
      )}

      {currentAnnouncement && (
        <span className="text-sm text-text-muted ml-2" data-testid="current-playing">
          Playing: {currentAnnouncement.title}
        </span>
      )}
    </div>
  );
}
