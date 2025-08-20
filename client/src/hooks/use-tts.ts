import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';

// Puter.js types
declare global {
  interface Window {
    puter?: {
      ai: {
        txt2speech: (text: string, options?: any) => Promise<HTMLAudioElement>;
      };
    };
  }
}

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
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  // Initialize Puter.js TTS with fallback to browser TTS
  useEffect(() => {
    const loadPuter = async () => {
      try {
        // Load Puter.js if not already loaded
        if (!window.puter) {
          const script = document.createElement('script');
          script.src = 'https://js.puter.com/v2/';
          script.async = true;
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            // Add timeout to prevent hanging
            setTimeout(() => reject(new Error('Timeout loading Puter.js')), 10000);
          });
        }
        
        setIsSupported(!!window.puter?.ai?.txt2speech);
        if (window.puter?.ai?.txt2speech) {
          fetchVoices();
        }
      } catch (error) {
        console.error('Failed to load Puter.js:', error);
        // Fallback to browser TTS if available
        const browserTTSSupported = 'speechSynthesis' in window;
        setIsSupported(browserTTSSupported);
        if (browserTTSSupported) {
          console.log('Falling back to browser TTS');
          fetchVoices(); // Will handle browser TTS voices
        }
      }
    };
    
    loadPuter();
  }, [fetchVoices]);

  const fetchVoices = useCallback(async () => {
    // Check if we have Puter.js or need to use browser TTS
    if (window.puter?.ai?.txt2speech) {
      // Puter.js provides predefined voices
      const predefinedVoices: Voice[] = [
      // English voices
      { voice_id: 'en-US-female-standard', name: 'Sarah (Female, US)', category: 'attendant', lang: 'en-US', gender: 'female', quality: 'neural' },
      { voice_id: 'en-US-male-standard', name: 'David (Male, US)', category: 'captain', lang: 'en-US', gender: 'male', quality: 'neural' },
      { voice_id: 'en-GB-female-standard', name: 'Emma (Female, UK)', category: 'attendant', lang: 'en-GB', gender: 'female', quality: 'neural' },
      { voice_id: 'en-GB-male-standard', name: 'James (Male, UK)', category: 'captain', lang: 'en-GB', gender: 'male', quality: 'neural' },
      
      // Spanish voices
      { voice_id: 'es-ES-female-standard', name: 'Maria (Female, Spain)', category: 'attendant', lang: 'es-ES', gender: 'female', quality: 'neural' },
      { voice_id: 'es-ES-male-standard', name: 'Carlos (Male, Spain)', category: 'captain', lang: 'es-ES', gender: 'male', quality: 'neural' },
      { voice_id: 'es-MX-female-standard', name: 'Sofia (Female, Mexico)', category: 'attendant', lang: 'es-MX', gender: 'female', quality: 'neural' },
      { voice_id: 'es-MX-male-standard', name: 'Diego (Male, Mexico)', category: 'captain', lang: 'es-MX', gender: 'male', quality: 'neural' },
      
      // French voices
      { voice_id: 'fr-FR-female-standard', name: 'Amelie (Female, France)', category: 'attendant', lang: 'fr-FR', gender: 'female', quality: 'neural' },
      { voice_id: 'fr-FR-male-standard', name: 'Pierre (Male, France)', category: 'captain', lang: 'fr-FR', gender: 'male', quality: 'neural' },
      { voice_id: 'fr-CA-female-standard', name: 'Celine (Female, Canada)', category: 'attendant', lang: 'fr-CA', gender: 'female', quality: 'neural' },
      
      // German voices
      { voice_id: 'de-DE-female-standard', name: 'Anna (Female, Germany)', category: 'attendant', lang: 'de-DE', gender: 'female', quality: 'neural' },
      { voice_id: 'de-DE-male-standard', name: 'Klaus (Male, Germany)', category: 'captain', lang: 'de-DE', gender: 'male', quality: 'neural' },
      
      // Italian voices
      { voice_id: 'it-IT-female-standard', name: 'Giulia (Female, Italy)', category: 'attendant', lang: 'it-IT', gender: 'female', quality: 'neural' },
      { voice_id: 'it-IT-male-standard', name: 'Marco (Male, Italy)', category: 'captain', lang: 'it-IT', gender: 'male', quality: 'neural' },
      
      // Portuguese voices
      { voice_id: 'pt-BR-female-standard', name: 'Ana (Female, Brazil)', category: 'attendant', lang: 'pt-BR', gender: 'female', quality: 'neural' },
      { voice_id: 'pt-BR-male-standard', name: 'João (Male, Brazil)', category: 'captain', lang: 'pt-BR', gender: 'male', quality: 'neural' },
      
      // Japanese voices
      { voice_id: 'ja-JP-female-standard', name: 'Yuki (Female, Japan)', category: 'attendant', lang: 'ja-JP', gender: 'female', quality: 'neural' },
      { voice_id: 'ja-JP-male-standard', name: 'Hiroshi (Male, Japan)', category: 'captain', lang: 'ja-JP', gender: 'male', quality: 'neural' },
      
      // Chinese voices
      { voice_id: 'zh-CN-female-standard', name: 'Li Wei (Female, China)', category: 'attendant', lang: 'zh-CN', gender: 'female', quality: 'neural' },
      { voice_id: 'zh-CN-male-standard', name: 'Wang Lei (Male, China)', category: 'captain', lang: 'zh-CN', gender: 'male', quality: 'neural' },
      
      // Korean voices
      { voice_id: 'ko-KR-female-standard', name: 'Min-jung (Female, Korea)', category: 'attendant', lang: 'ko-KR', gender: 'female', quality: 'neural' },
      { voice_id: 'ko-KR-male-standard', name: 'Seung-ho (Male, Korea)', category: 'captain', lang: 'ko-KR', gender: 'male', quality: 'neural' },
      
      // Russian voices
      { voice_id: 'ru-RU-female-standard', name: 'Katya (Female, Russia)', category: 'attendant', lang: 'ru-RU', gender: 'female', quality: 'neural' },
      { voice_id: 'ru-RU-male-standard', name: 'Ivan (Male, Russia)', category: 'captain', lang: 'ru-RU', gender: 'male', quality: 'neural' },
      
      // Arabic voices
      { voice_id: 'ar-SA-female-standard', name: 'Fatima (Female, Saudi Arabia)', category: 'attendant', lang: 'ar-SA', gender: 'female', quality: 'neural' },
      { voice_id: 'ar-SA-male-standard', name: 'Ahmed (Male, Saudi Arabia)', category: 'captain', lang: 'ar-SA', gender: 'male', quality: 'neural' },
      
      // Hindi voices
      { voice_id: 'hi-IN-female-standard', name: 'Priya (Female, India)', category: 'attendant', lang: 'hi-IN', gender: 'female', quality: 'neural' },
      { voice_id: 'hi-IN-male-standard', name: 'Arjun (Male, India)', category: 'captain', lang: 'hi-IN', gender: 'male', quality: 'neural' }
    ];
      
      setVoices(predefinedVoices);
      return predefinedVoices;
    } else {
      // Fallback to browser TTS
      const browserVoices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : [];
      const convertedVoices: Voice[] = browserVoices.map((voice, index) => ({
        voice_id: `browser-${index}`,
        name: voice.name,
        category: voice.name.toLowerCase().includes('female') ? 'attendant' : 'captain',
        lang: voice.lang,
        gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male',
        quality: 'standard'
      }));
      
      setVoices(convertedVoices);
      return convertedVoices;
    }
  }, []);

  const generateSpeech = useCallback(async (options: GenerateSpeechOptions) => {
    if (!isSupported) {
      toast({
        title: "TTS Not Available",
        description: "Text-to-speech service is loading or unavailable",
        variant: "destructive"
      });
      return;
    }
    
    // Try Puter.js first, then fallback to browser TTS
    if (window.puter?.ai?.txt2speech) {
      // Use Puter.js TTS
      // ... existing Puter.js logic
    } else if ('speechSynthesis' in window) {
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(options.text);
      utterance.rate = parseFloat(options.rate || '1.0');
      utterance.pitch = parseFloat(options.pitch || '1.0');
      utterance.volume = parseFloat(options.volume || '1.0');
      
      speechSynthesis.speak(utterance);
      return;
    }

    try {
      setIsLoading(true);
      
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }

      // Extract language from voice_id (e.g., 'en-US-female-standard' -> 'en-US')
      const langMatch = options.voice_id.match(/^([a-z]{2}-[A-Z]{2})/);
      const language = langMatch ? langMatch[1] : 'en-US';
      
      // Extract voice type
      const isFemale = options.voice_id.includes('female');
      const voiceName = isFemale ? 'Joanna' : 'Matthew'; // Default Puter voices
      
      const ttsOptions = {
        voice: voiceName,
        language: language,
        engine: 'neural' // Use neural engine for better quality
      };

      // Generate speech using Puter.js
      const audio = await window.puter.ai.txt2speech(options.text, ttsOptions);
      
      setCurrentAudio(audio);
      
      // Set up event handlers to ensure state is cleared
      audio.onended = () => {
        setCurrentAudio(null);
        setIsLoading(false);
      };
      
      audio.onerror = () => {
        setCurrentAudio(null);
        setIsLoading(false);
        toast({
          title: "Playback Error",
          description: "Failed to play generated speech",
          variant: "destructive"
        });
      };
      
      audio.onpause = () => {
        setCurrentAudio(null);
        setIsLoading(false);
      };
      
      // Play the audio
      await audio.play();

      return { audio };
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
  }, [currentAudio, toast, isSupported]);

  const stopSpeech = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsLoading(false);
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
    isSupported,
    currentAudio: !!currentAudio,
    fetchVoices,
    generateSpeech,
    stopSpeech,
    getAviationVoices
  };
}