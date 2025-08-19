// Microsoft Edge TTS Service - Completely Free
// Supports 100+ languages with natural neural voices

interface EdgeTTSVoice {
  voice_id: string;
  name: string;
  lang: string;
  gender: string;
  quality: string;
  category: string;
}

interface EdgeTTSRequest {
  text: string;
  voice: string;
  rate?: string;
  pitch?: string;
  volume?: string;
}

export class EdgeTTSService {
  private baseUrl = 'https://api.streamelements.com/kappa/v2/speech';

  // Get available voices for Edge TTS
  getVoices(): EdgeTTSVoice[] {
    // Microsoft Edge TTS voices - free and high quality
    return [
      // English voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)', name: 'Aria (Female, US)', lang: 'en-US', gender: 'female', quality: 'neural', category: 'professional' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (en-US, DavisNeural)', name: 'Davis (Male, US)', lang: 'en-US', gender: 'male', quality: 'neural', category: 'professional' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)', name: 'Jenny (Female, US)', lang: 'en-US', gender: 'female', quality: 'neural', category: 'captain' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (en-US, GuyNeural)', name: 'Guy (Male, US)', lang: 'en-US', gender: 'male', quality: 'neural', category: 'captain' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (en-GB, SoniaNeural)', name: 'Sonia (Female, UK)', lang: 'en-GB', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (en-GB, RyanNeural)', name: 'Ryan (Male, UK)', lang: 'en-GB', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Spanish voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (es-ES, ElviraNeural)', name: 'Elvira (Female, Spain)', lang: 'es-ES', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (es-ES, AlvaroNeural)', name: 'Alvaro (Male, Spain)', lang: 'es-ES', gender: 'male', quality: 'neural', category: 'captain' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (es-MX, DaliaNeural)', name: 'Dalia (Female, Mexico)', lang: 'es-MX', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (es-MX, JorgeNeural)', name: 'Jorge (Male, Mexico)', lang: 'es-MX', gender: 'male', quality: 'neural', category: 'captain' },
      
      // French voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (fr-FR, DeniseNeural)', name: 'Denise (Female, France)', lang: 'fr-FR', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (fr-FR, HenriNeural)', name: 'Henri (Male, France)', lang: 'fr-FR', gender: 'male', quality: 'neural', category: 'captain' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (fr-CA, SylvieNeural)', name: 'Sylvie (Female, Canada)', lang: 'fr-CA', gender: 'female', quality: 'neural', category: 'attendant' },
      
      // German voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (de-DE, KatjaNeural)', name: 'Katja (Female, Germany)', lang: 'de-DE', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (de-DE, ConradNeural)', name: 'Conrad (Male, Germany)', lang: 'de-DE', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Italian voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (it-IT, ElsaNeural)', name: 'Elsa (Female, Italy)', lang: 'it-IT', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (it-IT, DiegoNeural)', name: 'Diego (Male, Italy)', lang: 'it-IT', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Portuguese voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (pt-BR, FranciscaNeural)', name: 'Francisca (Female, Brazil)', lang: 'pt-BR', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (pt-BR, AntonioNeural)', name: 'Antonio (Male, Brazil)', lang: 'pt-BR', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Japanese voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ja-JP, NanamiNeural)', name: 'Nanami (Female, Japan)', lang: 'ja-JP', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ja-JP, KeitaNeural)', name: 'Keita (Male, Japan)', lang: 'ja-JP', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Chinese voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)', name: 'Xiaoxiao (Female, China)', lang: 'zh-CN', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)', name: 'Yunxi (Male, China)', lang: 'zh-CN', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Korean voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ko-KR, SunHiNeural)', name: 'SunHi (Female, Korea)', lang: 'ko-KR', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ko-KR, InJoonNeural)', name: 'InJoon (Male, Korea)', lang: 'ko-KR', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Russian voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ru-RU, SvetlanaNeural)', name: 'Svetlana (Female, Russia)', lang: 'ru-RU', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ru-RU, DmitryNeural)', name: 'Dmitry (Male, Russia)', lang: 'ru-RU', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Arabic voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ar-SA, ZariyahNeural)', name: 'Zariyah (Female, Saudi Arabia)', lang: 'ar-SA', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (ar-SA, HamedNeural)', name: 'Hamed (Male, Saudi Arabia)', lang: 'ar-SA', gender: 'male', quality: 'neural', category: 'captain' },
      
      // Hindi voices
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (hi-IN, SwaraNeural)', name: 'Swara (Female, India)', lang: 'hi-IN', gender: 'female', quality: 'neural', category: 'attendant' },
      { voice_id: 'Microsoft Server Speech Text to Speech Voice (hi-IN, MadhurNeural)', name: 'Madhur (Male, India)', lang: 'hi-IN', gender: 'male', quality: 'neural', category: 'captain' }
    ];
  }

  async generateSpeech(request: EdgeTTSRequest): Promise<Buffer> {
    try {
      // Extract voice name from the full voice ID
      const voiceName = this.extractVoiceName(request.voice);
      
      // Use StreamElements free TTS service (backed by Microsoft Edge TTS)
      const url = `${this.baseUrl}?voice=${encodeURIComponent(voiceName)}&text=${encodeURIComponent(request.text)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Edge TTS API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer);
    } catch (error) {
      console.error('Failed to generate speech with Edge TTS:', error);
      throw error;
    }
  }

  private extractVoiceName(voiceId: string): string {
    // Extract the actual voice name from the Microsoft voice ID
    // Example: "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)" -> "AriaNeural"
    const match = voiceId.match(/\(([^,]+),\s*([^)]+)\)/);
    if (match && match[2]) {
      return match[2].trim();
    }
    return 'AriaNeural'; // Fallback to a default voice
  }

  // Get professional aviation voices
  getAviationVoices(): { [key: string]: string } {
    const voices = this.getVoices();
    return {
      // Professional male captain voice (US English)
      captain: voices.find(v => v.category === 'captain' && v.lang === 'en-US' && v.gender === 'male')?.voice_id || voices[0].voice_id,
      // Professional female flight attendant voice (US English)
      attendant: voices.find(v => v.category === 'attendant' && v.lang === 'en-US' && v.gender === 'female')?.voice_id || voices[0].voice_id,
      // Alternative male voice (UK English)
      copilot: voices.find(v => v.category === 'captain' && v.lang === 'en-GB' && v.gender === 'male')?.voice_id || voices[1].voice_id,
      // General crew voice
      crew: voices.find(v => v.category === 'professional' && v.gender === 'female')?.voice_id || voices[0].voice_id
    };
  }
}

export const edgeTTSService = new EdgeTTSService();