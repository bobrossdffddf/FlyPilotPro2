import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  lang: string;
  gender: string;
  quality: string;
}

interface GenerateSpeechOptions {
  text: string;
  voice_id: string;
  rate?: string;
  pitch?: string;
  volume?: string;
}

export function useTTS() {
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
        description: "Failed to load natural voice options",
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
        description: "Unable to generate speech with natural voices.",
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
    // Find the best voices for aviation based on language and gender
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const allVoices = englishVoices.length > 0 ? englishVoices : voices;
    
    const maleVoices = allVoices.filter(v => v.gender === 'male');
    const femaleVoices = allVoices.filter(v => v.gender === 'female');
    const captainVoices = allVoices.filter(v => v.category === 'captain');
    const attendantVoices = allVoices.filter(v => v.category === 'attendant');
    const professionalVoices = allVoices.filter(v => v.category === 'professional');

    return {
      captain: captainVoices.find(v => v.gender === 'male') || maleVoices[0] || allVoices[0],
      attendant: attendantVoices.find(v => v.gender === 'female') || femaleVoices[0] || allVoices[1] || allVoices[0],
      copilot: captainVoices.find(v => v.gender === 'male' && v.lang === 'en-GB') || maleVoices[1] || maleVoices[0] || allVoices[0],
      crew: professionalVoices.find(v => v.gender === 'female') || femaleVoices[0] || allVoices[0]
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