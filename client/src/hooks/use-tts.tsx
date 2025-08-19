import { useState, useCallback, useRef } from "react";

interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
}

export function useTTS() {
  const [isSupported, setIsSupported] = useState(() => 'speechSynthesis' in window);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  const loadVoices = useCallback(() => {
    if (!isSupported) return;
    
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    // If voices aren't loaded yet, wait for the voiceschanged event
    if (availableVoices.length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        setVoices(speechSynthesis.getVoices());
      }, { once: true });
    }
  }, [isSupported]);

  // Load voices on mount
  useState(() => {
    loadVoices();
  });

  const speak = useCallback((text: string, options: TTSOptions = {}) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure utterance
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 0.8;

    // Select voice (prefer aviation/professional voices)
    if (options.voice) {
      const selectedVoice = voices.find(voice => voice.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    } else {
      // Prefer professional/aviation-style voices
      const preferredVoices = voices.filter(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('male') || 
               name.includes('daniel') || 
               name.includes('alex') ||
               name.includes('google uk english male') ||
               voice.lang.startsWith('en-');
      });
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('TTS Error:', event.error);
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      utteranceRef.current = null;
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isPlaying) {
      speechSynthesis.pause();
    }
  }, [isSupported, isPlaying]);

  const resume = useCallback(() => {
    if (isSupported) {
      speechSynthesis.resume();
    }
  }, [isSupported]);

  // Professional aviation announcement templates
  const speakAnnouncement = useCallback((type: string, data?: any) => {
    const announcements = {
      welcome: "Ladies and gentlemen, welcome aboard. Please ensure your seat belts are fastened and your seat backs and tray tables are in their full upright position.",
      seatbelt: "Ladies and gentlemen, the captain has turned on the seat belt sign. Please return to your seats and fasten your seat belts.",
      takeoff: "Flight attendants, prepare for takeoff.",
      cruising: "Ladies and gentlemen, we have reached our cruising altitude. You may now move about the cabin.",
      descent: "Ladies and gentlemen, we are beginning our descent. Please ensure your seat belts are fastened.",
      landing: "Flight attendants, prepare for landing.",
      arrival: `Ladies and gentlemen, welcome to ${data?.destination || 'your destination'}. Please remain seated until the aircraft has come to a complete stop.`,
      emergency: "This is an emergency announcement. Please remain calm and follow crew instructions immediately.",
      turbulence: "Ladies and gentlemen, we are experiencing some turbulence. Please return to your seats and fasten your seat belts."
    };

    const text = announcements[type as keyof typeof announcements];
    if (text) {
      speak(text, { rate: 0.85, volume: 0.9 });
    }
  }, [speak]);

  return {
    isSupported,
    isPlaying,
    voices,
    speak,
    stop,
    pause,
    resume,
    speakAnnouncement,
    loadVoices
  };
}