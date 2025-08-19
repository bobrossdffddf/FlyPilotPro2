import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

interface GenerateSpeechOptions {
  text: string;
  voice_id: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export function useElevenLabs() {
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const fetchVoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/voices');
      if (!response.ok) throw new Error('Failed to fetch voices');
      
      const voicesData = await response.json();
      setVoices(voicesData);
      return voicesData;
    } catch (error) {
      console.error('Error fetching voices:', error);
      toast({
        title: "Error",
        description: "Failed to load voice options",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const generateSpeech = useCallback(async (options: GenerateSpeechOptions) => {
    try {
      setIsLoading(true);
      
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);
      
      // Play the audio
      await audio.play();
      
      // Clean up the URL when audio ends
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      };

      return { audio, audioUrl };
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Speech Generation Failed",
        description: "Unable to generate speech. Please check your ElevenLabs configuration.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentAudio, toast]);

  const stopSpeech = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  }, [currentAudio]);

  // Professional aviation voices with fallbacks
  const getAviationVoices = useCallback(() => {
    const aviationVoiceIds = {
      captain: 'EXAVITQu4vr4xnSDxMaL', // Professional male captain
      attendant: '21m00Tcm4TlvDq8ikWAM', // Professional female flight attendant
      copilot: 'AZnzlk1XvdvUeBnXmlld', // Alternative male voice
      crew: 'pNInz6obpgDQGcFmaJgB', // General crew voice
    };

    return {
      captain: voices.find(v => v.voice_id === aviationVoiceIds.captain) || voices.find(v => v.category === 'professional' && v.name.toLowerCase().includes('male')) || voices[0],
      attendant: voices.find(v => v.voice_id === aviationVoiceIds.attendant) || voices.find(v => v.category === 'professional' && v.name.toLowerCase().includes('female')) || voices[1],
      copilot: voices.find(v => v.voice_id === aviationVoiceIds.copilot) || voices.find(v => v.category === 'professional') || voices[2],
      crew: voices.find(v => v.voice_id === aviationVoiceIds.crew) || voices[0]
    };
  }, [voices]);

  return {
    voices,
    isLoading,
    currentAudio: !!currentAudio,
    fetchVoices,
    generateSpeech,
    stopSpeech,
    getAviationVoices
  };
}