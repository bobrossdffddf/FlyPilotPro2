// Using native fetch API available in Node.js 18+

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

interface GenerateSpeechRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json() as { voices: ElevenLabsVoice[] };
      return data.voices;
    } catch (error) {
      console.error('Failed to fetch voices from ElevenLabs:', error);
      throw error;
    }
  }

  async generateSpeech(request: GenerateSpeechRequest): Promise<Buffer> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${request.voice_id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          model_id: request.model_id || 'eleven_monolingual_v1',
          voice_settings: request.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer);
    } catch (error) {
      console.error('Failed to generate speech with ElevenLabs:', error);
      throw error;
    }
  }

  // Get professional aviation voices
  getAviationVoices(): { [key: string]: string } {
    return {
      // Professional male captain voice
      captain: 'EXAVITQu4vr4xnSDxMaL', // Default professional male
      // Professional female flight attendant voice
      attendant: '21m00Tcm4TlvDq8ikWAM', // Default professional female
      // Alternative voices if available
      copilot: 'AZnzlk1XvdvUeBnXmlld', // Alternative male
      crew: 'EXAVITQu4vr4xnSDxMaL', // General crew
    };
  }
}

export const elevenLabsService = new ElevenLabsService(process.env.ELEVENLABS_API_KEY || '');