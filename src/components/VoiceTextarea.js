import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import voiceService from '../services/voiceService';

const VoiceTextarea = ({ 
  value, 
  onChange, 
  placeholder = "Type or speak your answer...",
  className = "",
  rows = 6,
  showTTS = true,
  showVoiceInput = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const textareaRef = useRef(null);

  const handleVoiceResult = (finalTranscript) => {
    const currentValue = value || '';
    const newValue = currentValue + (currentValue ? ' ' : '') + finalTranscript;
    onChange(newValue);
    setInterimText('');
  };

  const handleStartListening = () => {
    if (isListening) {
      voiceService.stopListening();
      return;
    }

    const success = voiceService.startListening({
      onResult: (finalTranscript, interimTranscript) => {
        setInterimText(interimTranscript);
        if (finalTranscript) {
          handleVoiceResult(finalTranscript);
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

  const handleSpeak = () => {
    if (!value) return;

    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      voiceService.speak(value, {
        rate: 0.9,
        pitch: 1,
        volume: 1
      });
      setIsSpeaking(true);
    }
  };

  const handleTextChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-y ${className}`}
          rows={rows}
        />
        
        {/* Voice Controls Overlay */}
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          {showVoiceInput && (
            <button
              onClick={handleStartListening}
              className={`p-1.5 rounded transition-colors ${
                isListening 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          
          {showTTS && value && (
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded transition-colors ${
                isSpeaking 
                  ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
                  : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
              }`}
              title={isSpeaking ? "Stop reading" : "Read aloud"}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {isListening && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening...</span>
            </div>
          )}
          {interimText && (
            <span className="italic">"{interimText}"</span>
          )}
        </div>
        
        {value && (
          <span>{value.length} characters</span>
        )}
      </div>
    </div>
  );
};

export default VoiceTextarea;