import { useState, useCallback, useRef, useEffect } from 'react';
import { elevenLabsService } from '../services/elevenLabsService';
import { Voice } from '../types/elevenlabs';

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Load available voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        console.log('🔄 Loading voices...');
        setIsLoading(true);
        setError(null);
        
        const availableVoices = await elevenLabsService.getVoices();
        console.log('✅ Voices loaded in hook:', availableVoices.length);
        setVoices(availableVoices);
        
        // Set default voice if available
        if (availableVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(availableVoices[0].voice_id);
          console.log('🎯 Default voice selected:', availableVoices[0].name);
        }
      } catch (err) {
        const errorMessage = 'Failed to load voices: ' + (err instanceof Error ? err.message : 'Unknown error');
        setError(errorMessage);
        console.error('❌ Error loading voices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (elevenLabsService.isConfigured()) {
      loadVoices();
    } else {
      setError('Eleven Labs API key not configured. Please check your .env file.');
      console.warn('⚠️ Service not configured');
    }
  }, [selectedVoice]);

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    console.log('🎬 Starting speak function with text:', text.substring(0, 50) + '...');
    
    if (!text.trim()) {
      setError('Please enter some text to convert to speech');
      return;
    }

    if (!selectedVoice) {
      setError('Please select a voice');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🚀 Starting TTS conversion...');

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Clean up previous audio URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      // Convert text to speech
      const audioBuffer = await elevenLabsService.textToSpeech({
        text,
        voice_id: selectedVoice,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      });

      console.log('🎵 Creating audio blob...');
      // Create audio blob and URL
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      console.log('🔊 Setting up audio player...');
      // Create and play audio
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onloadstart = () => console.log('📥 Audio loading started');
      audioRef.current.oncanplay = () => console.log('✅ Audio can play');
      audioRef.current.onplay = () => {
        console.log('▶️ Audio started playing');
        setIsPlaying(true);
      };
      audioRef.current.onended = () => {
        console.log('⏹️ Audio finished playing');
        setIsPlaying(false);
      };
      audioRef.current.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setError('Failed to play audio');
        setIsPlaying(false);
      };

      console.log('🎯 Attempting to play audio...');
      await audioRef.current.play();
      console.log('🎉 Audio play initiated successfully');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert text to speech';
      setError(errorMessage);
      console.error('❌ Text-to-speech error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice]);

  const stopSpeaking = useCallback(() => {
    console.log('⏹️ Stopping audio playback');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    isLoading,
    isPlaying,
    error,
    speak,
    stopSpeaking,
    isConfigured: elevenLabsService.isConfigured()
  };
};