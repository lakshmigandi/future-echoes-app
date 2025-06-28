import React, { useState } from 'react';
import { Play, Square, Volume2, Mic, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

export const TextToSpeechPanel: React.FC = () => {
  const [text, setText] = useState('');
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  
  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    isLoading,
    isPlaying,
    error,
    speak,
    stopSpeaking,
    isConfigured
  } = useTextToSpeech();

  const handleSpeak = () => {
    if (isPlaying) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  const selectedVoiceName = voices.find(v => v.voice_id === selectedVoice)?.name || 'Select Voice';

  // Debug info panel
  const debugInfo = {
    apiKeyConfigured: !!import.meta.env.VITE_ELEVENLABS_API_KEY,
    apiKeyLength: import.meta.env.VITE_ELEVENLABS_API_KEY?.length || 0,
    voicesLoaded: voices.length,
    selectedVoice: selectedVoice,
    isConfigured: isConfigured
  };

  if (!isConfigured) {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-bold text-red-300">Text-to-Speech</h3>
        </div>
        <div className="text-red-200 space-y-3">
          <p className="mb-2">⚠️ Configuration Issue</p>
          
          {/* Debug Information */}
          <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2">Debug Info:</p>
            <ul className="space-y-1 text-xs">
              <li>API Key Present: {debugInfo.apiKeyConfigured ? '✅ Yes' : '❌ No'}</li>
              <li>API Key Length: {debugInfo.apiKeyLength} characters</li>
              <li>Service Configured: {debugInfo.isConfigured ? '✅ Yes' : '❌ No'}</li>
            </ul>
          </div>

          <div className="space-y-2 text-sm">
            <p><strong>Steps to fix:</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-xs opacity-90">
              <li>Check your .env file exists in the project root</li>
              <li>Ensure it contains: VITE_ELEVENLABS_API_KEY=your_actual_key</li>
              <li>Get your API key from elevenlabs.io → Profile → API Key</li>
              <li>Restart the development server after adding the key</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <Volume2 className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-purple-300">Text-to-Speech</h3>
        <CheckCircle className="w-5 h-5 text-green-400" />
      </div>

      {/* Debug Panel (only show if there are issues) */}
      {(error || voices.length === 0) && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm font-semibold mb-2">Debug Information:</p>
          <div className="text-xs text-yellow-200 space-y-1">
            <p>Voices Loaded: {debugInfo.voicesLoaded}</p>
            <p>Selected Voice: {debugInfo.selectedVoice || 'None'}</p>
            <p>API Key Length: {debugInfo.apiKeyLength}</p>
          </div>
        </div>
      )}

      {/* Voice Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Select Voice ({voices.length} available)
        </label>
        <div className="relative">
          <button
            onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
            className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg px-4 py-3 text-left text-blue-100 hover:border-blue-400/50 transition-all duration-200 flex items-center justify-between"
            disabled={isLoading || voices.length === 0}
          >
            <span>{selectedVoiceName}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isVoiceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isVoiceDropdownOpen && voices.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-blue-500/30 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
              {voices.map((voice) => (
                <button
                  key={voice.voice_id}
                  onClick={() => {
                    setSelectedVoice(voice.voice_id);
                    setIsVoiceDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-600/20 transition-colors ${
                    selectedVoice === voice.voice_id ? 'bg-blue-600/30 text-blue-300' : 'text-blue-100'
                  }`}
                >
                  <div className="font-medium">{voice.name}</div>
                  {voice.description && (
                    <div className="text-xs text-blue-400 opacity-75">{voice.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Enter Text to Convert
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here... Try entering one of the time capsule messages!"
          className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg px-4 py-3 text-blue-100 placeholder-blue-400/50 resize-none focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSpeak}
          disabled={isLoading || !text.trim() || !selectedVoice || voices.length === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            isPlaying
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Converting...</span>
            </>
          ) : isPlaying ? (
            <>
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Speak</span>
            </>
          )}
        </button>

        {text && (
          <div className="text-sm text-blue-400">
            {text.length} characters
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-slate-600/30">
        <p className="text-xs text-blue-400/75 mb-2">Quick fill:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setText("Hello, this is a test of the text-to-speech feature.")}
            className="text-xs px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-full text-green-300 transition-colors"
          >
            Test Message
          </button>
          <button
            onClick={() => setText("We learned that connection isn't about bandwidth, but about understanding. The greatest networks we built were not of fiber, but of empathy.")}
            className="text-xs px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-full text-blue-300 transition-colors"
          >
            Digital Renaissance
          </button>
          <button
            onClick={() => setText("When minds could finally speak to minds, we discovered that silence was just as valuable as words.")}
            className="text-xs px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-full text-purple-300 transition-colors"
          >
            Neural Harmony
          </button>
        </div>
      </div>
    </div>
  );
};