import { useState, useEffect, useRef } from "react";
import { Announcement } from "@shared/schema";

export function useAudioPlayer(announcements: Announcement[], volume: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset when announcements change
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [announcements]);

  useEffect(() => {
    // Update volume when it changes
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const play = () => {
    if (announcements.length === 0) return;
    
    setIsPlaying(true);
    
    // In a real app, this would play actual audio files
    // For now, we'll simulate playback with timeouts
    const currentAnnouncement = announcements[currentIndex];
    const duration = parseDuration(currentAnnouncement.duration);
    
    timeoutRef.current = setTimeout(() => {
      next();
    }, duration);
  };

  const pause = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const next = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(prev => prev + 1);
      if (isPlaying) {
        // Continue playing next announcement
        const nextAnnouncement = announcements[currentIndex + 1];
        const duration = parseDuration(nextAnnouncement.duration);
        
        timeoutRef.current = setTimeout(() => {
          next();
        }, duration);
      }
    } else {
      // End of queue
      setIsPlaying(false);
      setCurrentIndex(0);
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Helper function to parse duration string (e.g., "1:45" -> 105000ms)
  const parseDuration = (durationStr: string): number => {
    const [minutes, seconds] = durationStr.split(':').map(Number);
    return (minutes * 60 + seconds) * 1000;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    currentIndex,
    play,
    pause,
    stop,
    next,
    previous,
  };
}
