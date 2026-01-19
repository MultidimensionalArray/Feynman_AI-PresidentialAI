import React, { useState, useEffect } from 'react';
import { Volume2, Mic, MicOff, Play, Pause, Square } from 'lucide-react';
import voiceService from '../services/voiceService';
const defaultVoiceSettings = {
  ttsRate: 0.9,
  ttsPitch: 1,
  ttsVolume: 1,
  ttsVoice: '',
};

const VoiceControls = ({ 
  text, 
  onVoiceResult, 
  showTTS = true, 
  showRecognition = false,
  className = "" 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isSupported, setIsSupported] = useState({ tts: false, recognition: false });
  const [voiceSettings, setVoiceSettings] = useState(defaultVoiceSettings);

  useEffect(() => {
    // Check browser support
    const support = voiceService.isSupported();
    setIsSupported(support);

    // Preload voices
    voiceService.preloadVoices();

    const loadVoiceSettings = () => {
      const savedSettings = localStorage.getItem('voiceSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setVoiceSettings({ ...defaultVoiceSettings, ...parsed });
      } else {
        setVoiceSettings(defaultVoiceSettings);
      }
    };
    
    loadVoiceSettings();
    
    const handleSettingsChange = () => {
      loadVoiceSettings();
    };
    
    window.addEventListener('voiceSettingsChanged', handleSettingsChange);

    // Cleanup on unmount
    return () => {
      voiceService.stopSpeaking();
      voiceService.stopListening();
      window.removeEventListener('voiceSettingsChanged', handleSettingsChange);
    };
  }, []);

  const handleSpeak = () => {
    if (!text) return;

    if (isSpeaking) {
      if (isPaused) {
        voiceService.resumeSpeaking();
        setIsPaused(false);
      } else {
        voiceService.pauseSpeaking();
        setIsPaused(true);
      }
    } else {
      voiceService.speak(text, {
        rate: voiceSettings.ttsRate || defaultVoiceSettings.ttsRate,
        pitch: voiceSettings.ttsPitch || defaultVoiceSettings.ttsPitch,
        volume: voiceSettings.ttsVolume || defaultVoiceSettings.ttsVolume,
        voiceName: voiceSettings.ttsVoice,
      });
      setIsSpeaking(true);
      setIsPaused(false);
    }
  };

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleStartListening = () => {
    if (isListening) {
      voiceService.stopListening();
      return;
    }

    const success = voiceService.startListening({
      onResult: (finalTranscript, interimTranscript) => {
        setInterimText(interimTranscript);
        if (finalTranscript && onVoiceResult) {
          onVoiceResult(finalTranscript);
          setInterimText('');
        }
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
        setInterimText('');
      },
      onEnd: () => {
        setIsListening(false);
        setInterimText('');
      }
    });

    if (success) {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
    setInterimText('');
  };

  // Update speaking state based on voice service
  useEffect(() => {
    const checkSpeakingState = () => {
      setIsSpeaking(voiceService.isSpeaking);
    };

    const interval = setInterval(checkSpeakingState, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isSupported.tts && !isSupported.recognition) {
    return null; // Don't show controls if neither feature is supported
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Text-to-Speech Controls */}
      {showTTS && isSupported.tts && text && (
        <div className="flex items-center space-x-1">
          {!isSpeaking ? (
            <button
              onClick={handleSpeak}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Read aloud"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleSpeak}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button
                onClick={handleStopSpeaking}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Stop"
              >
                <Square className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Speech Recognition Controls */}
      {showRecognition && isSupported.recognition && (
        <div className="flex items-center space-x-1">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          
          {isListening && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Listening...</span>
            </div>
          )}
        </div>
      )}

      {/* Interim text display */}
      {interimText && (
        <div className="text-xs text-gray-500 italic">
          "{interimText}"
        </div>
      )}
    </div>
  );
};

export default VoiceControls;
