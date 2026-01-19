import React, { useState, useEffect, useRef } from 'react';
import { Settings, Volume2, Mic, Check, User, Palette, Sparkles, Upload, X, Image, Plus } from 'lucide-react';
import voiceService from '../services/voiceService';
import { 
  getPersonaOptions,
  loadCustomGuides,
  saveCustomGuides,
  avatarPresets, 
  defaultCharacterSelection,
  findPersonaById,
  findAvatarById,
  getDefaultAvatarForPersona
} from '../config/characterProfiles';

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

  const [characterSelection, setCharacterSelection] = useState(defaultCharacterSelection);
  const [guideOptions, setGuideOptions] = useState(getPersonaOptions());
  const [voices, setVoices] = useState([]);
  const [isSupported, setIsSupported] = useState({ tts: false, recognition: false });
  const [imagePreview, setImagePreview] = useState(null);
  const [customGuide, setCustomGuide] = useState({
    name: '',
    shortName: '',
    tagline: '',
    introMessage: '',
    tone: '',
    encouragementStyle: '',
    styleGuide: '',
  });
  const [customGuideError, setCustomGuideError] = useState('');
  const fileInputRef = useRef(null);

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

    // Load saved character selection
    const savedCharacter = localStorage.getItem('characterSelection');
    if (savedCharacter) {
      const parsed = JSON.parse(savedCharacter);
      const personaExists = getPersonaOptions().some((persona) => persona.id === parsed.personaId);
      const nextSelection = personaExists ? parsed : defaultCharacterSelection;
      setCharacterSelection(nextSelection);
      if (!personaExists) {
        localStorage.setItem('characterSelection', JSON.stringify(nextSelection));
      }
    }

    setGuideOptions(getPersonaOptions());

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
    window.dispatchEvent(new CustomEvent('voiceSettingsChanged'));
  };

  const handleCharacterChange = (type, value) => {
    let newSelection = { ...characterSelection, [type]: value };
    
    // If changing personality, automatically set the default avatar
    if (type === 'personaId') {
      const defaultAvatar = getDefaultAvatarForPersona(value);
      
      newSelection = {
        ...newSelection,
        avatarId: defaultAvatar.id,
        customAppearance: defaultAvatar.appearance
      };
    }
    
    setCharacterSelection(newSelection);
    localStorage.setItem('characterSelection', JSON.stringify(newSelection));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('characterSelectionChanged'));
  };

  const handleCustomGuideChange = (key, value) => {
    setCustomGuide(prev => ({ ...prev, [key]: value }));
    if (customGuideError) {
      setCustomGuideError('');
    }
  };

  const handleAddCustomGuide = () => {
    const name = customGuide.name.trim();
    const introMessage = customGuide.introMessage.trim();
    if (!name || !introMessage) {
      setCustomGuideError('Please provide at least a name and intro message.');
      return;
    }

    const idBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const id = `custom_${idBase || 'guide'}_${Date.now()}`;
    const styleGuide = customGuide.styleGuide
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const newGuide = {
      id,
      name,
      shortName: customGuide.shortName.trim() || name.split(' ')[0],
      tagline: customGuide.tagline.trim() || 'Custom learning guide.',
      introMessage,
      tone: customGuide.tone.trim() || 'Friendly and clear.',
      encouragementStyle:
        customGuide.encouragementStyle.trim() || 'Supportive and practical.',
      styleGuide: styleGuide.length > 0 ? styleGuide : ['Keep explanations clear and concise.'],
      voice: { rate: 0.95, pitch: 1, volume: 1, lang: 'en-US' },
      isCustom: true,
    };

    const updatedGuides = [...loadCustomGuides(), newGuide];
    saveCustomGuides(updatedGuides);
    setGuideOptions(getPersonaOptions());
    setCustomGuideError('');
    setCustomGuide({
      name: '',
      shortName: '',
      tagline: '',
      introMessage: '',
      tone: '',
      encouragementStyle: '',
      styleGuide: '',
    });

    handleCharacterChange('personaId', newGuide.id);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        
        // Update character selection to use custom image
        const customAvatar = findAvatarById('custom_image');
        const newSelection = {
          ...characterSelection,
          avatarId: 'custom_image',
          customAppearance: {
            ...customAvatar.appearance,
            imageUrl: imageUrl,
            customImage: true
          }
        };
        
        setCharacterSelection(newSelection);
        localStorage.setItem('characterSelection', JSON.stringify(newSelection));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('characterSelectionChanged'));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomImage = () => {
    setImagePreview(null);
    
    // Reset to default character
    const defaultAvatar = getDefaultAvatarForPersona(characterSelection.personaId);
    const newSelection = {
      ...characterSelection,
      avatarId: defaultAvatar.id,
      customAppearance: defaultAvatar.appearance
    };
    
    setCharacterSelection(newSelection);
    localStorage.setItem('characterSelection', JSON.stringify(newSelection));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('characterSelectionChanged'));
  };

  const testVoice = () => {
    const persona = findPersonaById(characterSelection.personaId);
    const testText = persona?.introMessage || "Let's explore this idea together.";

    voiceService.speak(testText, {
      rate: settings.ttsRate,
      pitch: settings.ttsPitch,
      volume: settings.ttsVolume,
      lang: persona?.voice?.lang || 'en-US',
      voiceName: settings.ttsVoice,
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
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Guide Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close guide settings"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Character Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Choose Your Learning Guide
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {guideOptions.map((persona) => (
                  <div
                    key={persona.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      characterSelection.personaId === persona.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleCharacterChange('personaId', persona.id)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        characterSelection.personaId === persona.id ? 'bg-primary-500' : 'bg-gray-300'
                      }`}></div>
                      <h4 className="font-medium text-gray-900">{persona.shortName}</h4>
                      {persona.isCustom && (
                        <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{persona.tagline}</p>
                    <p className="text-xs text-gray-500 italic">"{persona.introMessage}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Guide Builder */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Your Own Guide
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    value={customGuide.name}
                    onChange={(e) => handleCustomGuideChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Grace Hopper"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Short Name</label>
                  <input
                    value={customGuide.shortName}
                    onChange={(e) => handleCustomGuideChange('shortName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Optional nickname"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <input
                    value={customGuide.tagline}
                    onChange={(e) => handleCustomGuideChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="A short description of their style"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Intro Message</label>
                  <textarea
                    value={customGuide.introMessage}
                    onChange={(e) => handleCustomGuideChange('introMessage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Greeting the learner in your guide's voice"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Tone</label>
                  <input
                    value={customGuide.tone}
                    onChange={(e) => handleCustomGuideChange('tone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Supportive, direct, playful..."
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Encouragement Style</label>
                  <input
                    value={customGuide.encouragementStyle}
                    onChange={(e) => handleCustomGuideChange('encouragementStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="How your guide supports the learner"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Style Guide</label>
                  <textarea
                    value={customGuide.styleGuide}
                    onChange={(e) => handleCustomGuideChange('styleGuide', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder="One guideline per line or separated by commas"
                  />
                </div>
              </div>
              {customGuideError && (
                <p className="text-sm text-red-600">{customGuideError}</p>
              )}
              <button
                onClick={handleAddCustomGuide}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Custom Guide
              </button>
            </div>

            {/* Avatar Style Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Avatar Style
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {avatarPresets.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      characterSelection.avatarId === avatar.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleCharacterChange('avatarId', avatar.id)}
                  >
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full mx-auto mb-2 border-2"
                        style={{ 
                          backgroundColor: avatar.appearance.skinTone,
                          borderColor: avatar.appearance.outlineColor
                        }}
                      ></div>
                      <h4 className="text-sm font-medium text-gray-900">{avatar.label}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Custom Mentor Image
              </h3>
              
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Custom mentor preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Custom Image Selected</p>
                      <p className="text-xs text-gray-500">Your personal mentor image</p>
                    </div>
                    <button
                      onClick={removeCustomImage}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove custom image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {/* Upload Button */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {imagePreview ? 'Change Image' : 'Upload Custom Image'}
                    </span>
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Upload a JPG, PNG, or GIF image (max 5MB)
                  </p>
                </div>
              </div>
            </div>

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
                onClick={() => {
                  // Trigger character change event to update all components
                  window.dispatchEvent(new CustomEvent('characterSelectionChanged'));
                  onClose();
                }}
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
