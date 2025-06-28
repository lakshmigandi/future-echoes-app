import { Voice, TTSRequest } from '../types/elevenlabs';

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    console.log('🔑 API Key loaded:', this.apiKey ? 'Yes (length: ' + this.apiKey.length + ')' : 'No');
    if (!this.apiKey) {
      console.warn('❌ Eleven Labs API key not found. Please add VITE_ELEVENLABS_API_KEY to your .env file');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.apiKey) {
      throw new Error('Eleven Labs API key is required');
    }

    console.log('🌐 Making request to:', `${this.baseUrl}${endpoint}`);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`Eleven Labs API error: ${response.status} - ${errorText}`);
    }

    return response;
  }

  async getVoices(): Promise<Voice[]> {
    try {
      console.log('🎤 Fetching voices...');
      const response = await this.makeRequest('/voices');
      const data = await response.json();
      console.log('✅ Voices loaded:', data.voices?.length || 0);
      return data.voices || [];
    } catch (error) {
      console.error('❌ Failed to fetch voices:', error);
      // Return default voices as fallback
      const defaultVoices = [
        {
          voice_id: 'EXAVITQu4vr4xnSDxMaL',
          name: 'Bella',
          category: 'premade',
          description: 'American Female'
        },
        {
          voice_id: 'ErXwobaYiN019PkySvjV',
          name: 'Antoni',
          category: 'premade',
          description: 'American Male'
        },
        {
          voice_id: 'VR6AewLTigWG4xSOukaG',
          name: 'Arnold',
          category: 'premade',
          description: 'American Male'
        }
      ];
      console.log('🔄 Using default voices as fallback');
      return defaultVoices;
    }
  }

  async textToSpeech(request: TTSRequest): Promise<ArrayBuffer> {
    try {
      console.log('🗣️ Converting text to speech:', {
        text: request.text.substring(0, 50) + '...',
        voice_id: request.voice_id,
        text_length: request.text.length
      });

      const response = await this.makeRequest(`/text-to-speech/${request.voice_id}`, {
        method: 'POST',
        body: JSON.stringify({
          text: request.text,
          model_id: request.model_id || 'eleven_monolingual_v1',
          voice_settings: request.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      const audioBuffer = await response.arrayBuffer();
      console.log('✅ Audio generated, size:', audioBuffer.byteLength, 'bytes');
      return audioBuffer;
    } catch (error) {
      console.error('❌ Text-to-speech conversion failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    const configured = !!this.apiKey;
    console.log('⚙️ Service configured:', configured);
    return configured;
  }
}

export const elevenLabsService = new ElevenLabsService();