import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  lang: string;
}

interface GenerateSpeechOptions {
  text: string;
  voice_id: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export function useTTS() {
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    if ('speechSynthesis' in window) {
      // Load voices when they become available
      const loadVoices = () => {
        const browserVoices = window.speechSynthesis.getVoices();
        if (browserVoices.length > 0) {
          fetchVoices();
        }
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      loadVoices(); // Try loading immediately
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const fetchVoices = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "TTS Not Supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
      return [];
    }

    try {
      setIsLoading(true);
      const browserVoices = window.speechSynthesis.getVoices();
      
      const voicesData: Voice[] = browserVoices.map((voice, index) => {
        // Categorize voices based on language and name
        let category = 'general';
        const name = voice.name.toLowerCase();
        
        if (name.includes('male') || name.includes('man') || name.includes('guy')) {
          category = 'male';
        } else if (name.includes('female') || name.includes('woman') || name.includes('lady')) {
          category = 'female';
        } else if (name.includes('professional') || name.includes('business')) {
          category = 'professional';
        }
        
        return {
          voice_id: `${voice.name}-${index}`,
          name: voice.name,
          category,
          description: `${voice.lang} voice`,
          lang: voice.lang
        };
      });
      
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
  }, [toast, isSupported]);

  const generateSpeech = useCallback(async (options: GenerateSpeechOptions) => {
    if (!isSupported) {
      toast({
        title: "TTS Not Supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Stop current speech if playing
      if (currentUtterance) {
        window.speechSynthesis.cancel();
        setCurrentUtterance(null);
      }

      const utterance = new SpeechSynthesisUtterance(options.text);
      
      // Find the voice by voice_id
      const browserVoices = window.speechSynthesis.getVoices();
      const targetVoice = browserVoices.find((voice, index) => 
        `${voice.name}-${index}` === options.voice_id
      );
      
      if (targetVoice) {
        utterance.voice = targetVoice;
        utterance.lang = targetVoice.lang;
      }
      
      // Set speech parameters
      utterance.rate = options.rate || 0.9; // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      // Set up event handlers
      utterance.onstart = () => {
        setCurrentUtterance(utterance);
      };
      
      utterance.onend = () => {
        setCurrentUtterance(null);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setCurrentUtterance(null);
        toast({
          title: "Speech Error",
          description: "An error occurred during speech synthesis",
          variant: "destructive"
        });
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      return { utterance };
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Speech Generation Failed",
        description: "Unable to generate speech. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUtterance, toast, isSupported]);

  const stopSpeech = useCallback(() => {
    if (currentUtterance && isSupported) {
      window.speechSynthesis.cancel();
      setCurrentUtterance(null);
    }
  }, [currentUtterance, isSupported]);

  // Professional aviation voices with fallbacks
  const getAviationVoices = useCallback(() => {
    // Find the best voices for aviation based on language and gender
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const allVoices = englishVoices.length > 0 ? englishVoices : voices;
    
    const maleVoices = allVoices.filter(v => 
      v.category === 'male' || 
      v.name.toLowerCase().includes('male') || 
      v.name.toLowerCase().includes('man') ||
      v.name.toLowerCase().includes('guy')
    );
    
    const femaleVoices = allVoices.filter(v => 
      v.category === 'female' || 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('lady')
    );
    
    const professionalVoices = allVoices.filter(v => 
      v.category === 'professional' ||
      v.name.toLowerCase().includes('professional') ||
      v.name.toLowerCase().includes('business')
    );

    return {
      captain: professionalVoices.find(v => maleVoices.includes(v)) || maleVoices[0] || allVoices[0],
      attendant: professionalVoices.find(v => femaleVoices.includes(v)) || femaleVoices[0] || allVoices[1] || allVoices[0],
      copilot: maleVoices[1] || maleVoices[0] || allVoices[2] || allVoices[0],
      crew: professionalVoices[0] || allVoices[0]
    };
  }, [voices]);

  return {
    voices,
    isLoading,
    isSupported,
    currentAudio: !!currentUtterance,
    fetchVoices,
    generateSpeech,
    stopSpeech,
    getAviationVoices
  };
}