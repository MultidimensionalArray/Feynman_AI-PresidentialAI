import React, { useState, useEffect } from 'react';
import { Settings, Volume2, Mic, Check } from 'lucide-react';
import voiceService from '../services/voiceService';

const VoiceSettings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    ttsEnabled: true,
    speechRecognitionEnabled: true,
    ttsRate: 0.9,
    ttsPitch: 1,
    ttsVolume: 1,
    ttsVoice: '',
    autoRead: false
  });

  const [voices, setVoices] = useState([]);
  const [isSupported, setIsSupported] = useState({ tts: false, recognition: false });

  useEffect(() => {
    // Check browser support
    const support = voiceService.isSupported();
    setIsSupported(support);

    // Load voices
    const loadVoices = () => {
      const availableVoices = voiceService.getAvailableVoices();
      setVoices(availableVoices);
      
      // Set default voice if not already set
      if (!settings.ttsVoice && availableVoices.length > 0) {
        const preferredVoice = availableVoices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Alex')
        );
        
        if (preferredVoice) {
          setSettings(prev => ({ ...prev, ttsVoice: preferredVoice.name }));
        }
      }
    };

    loadVoices();
    
    // Load voices again after they're available
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('voiceSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('voiceSettings', JSON.stringify(newSettings));
  };

  const testVoice = () => {
    const testText = "This is a test of the text-to-speech feature. How does it sound?";
    voiceService.speak(testText, {
      rate: settings.ttsRate,
      pitch: settings.ttsPitch,
      volume: settings.ttsVolume,
      voice: voices.find(v => v.name === settings.ttsVoice)
    });
  };

  const testRecognition = () => {
    voiceService.startListening({
      onResult: (finalTranscript) => {
        alert(`You said: "${finalTranscript}"`);
      },
      onError: (error) => {
        alert(`Recognition error: ${error}`);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Voice Settings
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close voice settings"
            >
              &times;
            </button>
          </div>

          <div className="space-y-6">
            {/* Text-to-Speech Settings */}
            {isSupported.tts && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Text-to-Speech
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.ttsEnabled}
                      onChange={(e) => handleSettingChange('ttsEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable text-to-speech</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoRead}
                      onChange={(e) => handleSettingChange('autoRead', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Auto-read explanations</span>
                  </label>

                  {voices.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Voice
                      </label>
                      <select
                        value={settings.ttsVoice}
                        onChange={(e) => handleSettingChange('ttsVoice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {voices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speed: {settings.ttsRate.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.ttsRate}
                      onChange={(e) => handleSettingChange('ttsRate', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pitch: {settings.ttsPitch.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.ttsPitch}
                      onChange={(e) => handleSettingChange('ttsPitch', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume: {Math.round(settings.ttsVolume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.ttsVolume}
                      onChange={(e) => handleSettingChange('ttsVolume', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={testVoice}
                    className="w-full btn-secondary text-sm"
                  >
                    Test Voice
                  </button>
                </div>
              </div>
            )}

            {/* Speech Recognition Settings */}
            {isSupported.recognition && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Speech Recognition
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.speechRecognitionEnabled}
                      onChange={(e) => handleSettingChange('speechRecognitionEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable voice input</span>
                  </label>

                  <button
                    onClick={testRecognition}
                    className="w-full btn-secondary text-sm"
                  >
                    Test Recognition
                  </button>
                </div>
              </div>
            )}

            {/* Browser Support Info */}
            {(!isSupported.tts && !isSupported.recognition) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  Voice features are not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
                </p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="btn-primary flex items-center"
              >
                <Check className="h-4 w-4 mr-1" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;
