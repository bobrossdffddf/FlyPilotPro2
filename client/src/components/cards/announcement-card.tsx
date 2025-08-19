import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Announcement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AnnouncementCardProps {
  announcement: Announcement;
  onAddToQueue: () => void;
}

export default function AnnouncementCard({ announcement, onAddToQueue }: AnnouncementCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/announcements/${announcement.id}`, {
        isFavorite: !announcement.isFavorite,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      toast({
        title: announcement.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${announcement.title} has been ${announcement.isFavorite ? "removed from" : "added to"} your favorites.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    },
  });

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      // In a real app, this would stop the audio
    } else {
      setIsPlaying(true);
      // In a real app, this would play the audio file
      // Simulate playback duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  };

  const getIconColorClass = () => {
    switch (announcement.iconColor) {
      case "aviation-blue":
        return "text-aviation-blue bg-aviation-blue/20";
      case "warning-orange":
        return "text-warning-orange bg-warning-orange/20";
      case "caution-yellow":
        return "text-caution-yellow bg-caution-yellow/20";
      case "nav-green":
        return "text-nav-green bg-nav-green/20";
      default:
        return "text-aviation-blue bg-aviation-blue/20";
    }
  };

  return (
    <div className="bg-panel-bg rounded-xl border border-panel-gray p-6 hover:shadow-cockpit transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColorClass()}`}>
            <i className={announcement.icon}></i>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary" data-testid="announcement-title">
              {announcement.title}
            </h3>
            <p className="text-sm text-text-muted">{announcement.description}</p>
          </div>
        </div>
        <span className="text-xs bg-nav-green/20 text-nav-green px-2 py-1 rounded font-mono">
          {announcement.duration}
        </span>
      </div>
      
      <p className="text-sm text-text-secondary mb-4 leading-relaxed line-clamp-2">
        {announcement.content}
      </p>
      
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePlay}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isPlaying
              ? "bg-warning-orange hover:bg-warning-orange/80"
              : "bg-aviation-blue hover:bg-aviation-blue/80"
          } text-white`}
          data-testid="button-play-announcement"
        >
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"} text-sm`}></i>
          <span className="text-sm font-medium">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </Button>
        
        <div className="flex space-x-2">
          <button
            onClick={onAddToQueue}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            title="Add to Queue"
            data-testid="button-add-to-queue"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            onClick={() => toggleFavoriteMutation.mutate()}
            disabled={toggleFavoriteMutation.isPending}
            className={`p-2 transition-colors ${
              announcement.isFavorite
                ? "text-warning-orange"
                : "text-text-secondary hover:text-text-primary"
            }`}
            title="Favorite"
            data-testid="button-toggle-favorite"
          >
            <i className={`${announcement.isFavorite ? "fas" : "far"} fa-star`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
