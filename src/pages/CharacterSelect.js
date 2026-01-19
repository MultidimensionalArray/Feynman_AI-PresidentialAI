import React, { useEffect, useMemo, useState } from 'react';
import { Volume2, CheckCircle, RefreshCw, Sparkles, Palette, Wand2 } from 'lucide-react';
import Character from '../components/Character';
import { useCharacter } from '../context/CharacterContext';
import voiceService from '../services/voiceService';

const swatchGroups = [
  {
    key: 'hairColor',
    label: 'Hair',
    swatches: ['#92400E', '#1F2937', '#4C1D95', '#065F46', '#111827'],
  },
  {
    key: 'clothingColor',
    label: 'Outfit',
    swatches: ['#2563EB', '#10B981', '#F97316', '#8B5CF6', '#6B7280'],
  },
  {
    key: 'accentColor',
    label: 'Accent',
    swatches: ['#1D4ED8', '#34D399', '#FB923C', '#6366F1', '#F472B6'],
  },
  {
    key: 'backgroundColor',
    label: 'Backdrop',
    swatches: ['#EFF6FF', '#ECFDF5', '#FFF7ED', '#F5F3FF', '#F3F4F6'],
  },
];

const CharacterSelect = () => {
  const { character, updateSelection, resetToDefault, options } = useCharacter();
  const [expression, setExpression] = useState('friendly');
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    const support = voiceService.isSupported();
    if (!support.tts) {
      return;
    }

    const loadVoices = () => {
      const voices = voiceService.getAvailableVoices();
      setAvailableVoices(voices);
    };

    loadVoices();

    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  const personaDetails = useMemo(() => {
    if (!character.persona) return [];
    const { tone, encouragementStyle, styleGuide } = character.persona;
    return [
      `Tone: ${tone}`,
      `Encouragement: ${encouragementStyle}`,
      styleGuide ? `Style tips: ${styleGuide.join(', ')}` : undefined,
    ]
      .filter(Boolean)
      .map((detail) => detail);
  }, [character.persona]);

  const handleVoicePreview = (voice) => {
    const sample = voice.sample || "Let's explore this idea together and keep learning fun.";
    voiceService.speak(sample, {
      ...voice.settings,
      preferredVoices: voice.preferredVoices,
    });
  };

  const handleAvatarSelect = (avatar) => {
    updateSelection({
      avatarId: avatar.id,
      customAppearance: { ...avatar.appearance },
    });
  };

  const handleSwatchClick = (key, value) => {
    updateSelection({
      customAppearance: { [key]: value },
    });
  };

  const handleKeyboardActivate = (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose Your Learning Companion</h1>
          <p className="text-lg text-gray-600">
            Personalize the guide who joins you on every Feynman session. Pick a voice, avatar, and
            personality that keeps you motivated.
          </p>
        </div>
        <button
          type="button"
          onClick={resetToDefault}
          className="inline-flex items-center space-x-2 btn-secondary self-start"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset to default</span>
        </button>
      </header>

      <section className="grid md:grid-cols-5 gap-8 items-stretch">
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <span>Live Preview</span>
            </h2>
            <div className="flex space-x-2">
              {['friendly', 'thinking', 'excited', 'encouraging', 'focused'].map((expr) => (
                <button
                  key={expr}
                  type="button"
                  onClick={() => setExpression(expr)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors ${
                    expression === expr
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-primary-200 hover:text-primary-600'
                  }`}
                >
                  {expr}
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-6 flex flex-col items-center text-center"
            style={{ backgroundColor: character.appearance.backgroundColor }}
          >
            <Character expression={expression} size="xl" appearance={character.appearance} />
            <div className="mt-6 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{character.persona?.name}</h3>
              <p className="text-sm text-gray-600">{character.persona?.tagline}</p>
              {personaDetails.length > 0 && (
                <div className="text-xs text-gray-500 space-y-1">
                  {personaDetails.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-primary-500" />
                <span>Voice Style</span>
              </h2>
              <span className="text-sm text-gray-500">
                Selected: {character.voice?.label || 'Warm Mentor'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {options.voices.map((voice) => {
                const isSelected = character.voiceId === voice.id;
                const selectVoice = () => updateSelection({ voiceId: voice.id });
                const microsoftPreferred = voice.preferredVoices.filter((name) =>
                  name.toLowerCase().includes('microsoft'),
                );
                const microsoftAvailable = availableVoices.filter((browserVoice) =>
                  microsoftPreferred.some((preferred) =>
                    browserVoice.name.toLowerCase().includes(preferred.toLowerCase()),
                  ),
                );
                const microsoftLabels =
                  microsoftAvailable.length > 0
                    ? Array.from(new Set(microsoftAvailable.map((v) => v.name)))
                    : Array.from(new Set(microsoftPreferred));

                return (
                  <div
                    key={voice.id}
                    role="button"
                    tabIndex={0}
                    onClick={selectVoice}
                    onKeyDown={(event) => handleKeyboardActivate(event, selectVoice)}
                    className={`text-left p-4 rounded-xl border transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                      isSelected
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{voice.label}</h3>
                        <p className="text-sm text-gray-600">{voice.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="h-5 w-5 text-primary-500" />}
                    </div>
                    <p className="text-sm text-gray-500 italic mb-3">{voice.sample}</p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleVoicePreview(voice);
                      }}
                      className="inline-flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Preview voice</span>
                    </button>
                    {microsoftLabels.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Microsoft voices
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {microsoftLabels.map((name) => (
                            <span
                              key={`${voice.id}-${name}`}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary-500" />
                <span>Avatar Style</span>
              </h2>
              <span className="text-sm text-gray-500">
                Selected: {character.avatar?.label || 'Mentor Classic'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {options.avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`p-4 rounded-xl border transition-all hover:shadow flex items-center space-x-4 ${
                    character.avatarId === avatar.id
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center">
                    <Character
                      expression="friendly"
                      size="small"
                      appearance={avatar.appearance}
                      showAnimation={false}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-900">{avatar.label}</h3>
                    <p className="text-sm text-gray-600">
                      {Object.values(avatar.appearance)
                        .slice(1, 3)
                        .join(' | ')}
                    </p>
                  </div>
                  {character.avatarId === avatar.id && (
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Fine-tune palette
              </h3>
              <div className="space-y-3">
                {swatchGroups.map((group) => (
                  <div key={group.key}>
                    <p className="text-xs font-medium text-gray-500 mb-2">{group.label}</p>
                    <div className="flex space-x-2">
                      {group.swatches.map((swatch) => (
                        <button
                          key={swatch}
                          type="button"
                          onClick={() => handleSwatchClick(group.key, swatch)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            character.appearance[group.key] === swatch
                              ? 'border-primary-500 scale-105'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: swatch }}
                          aria-label={`${group.label} color`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-primary-500" />
                <span>Personality</span>
              </h2>
              <span className="text-sm text-gray-500">
                Active: {character.persona?.name || 'Alex the Encouraging Mentor'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {options.personas.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => updateSelection({ personaId: persona.id })}
                  className={`text-left p-4 rounded-xl border transition-all hover:shadow ${
                    character.personaId === persona.id
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{persona.tagline}</p>
                    </div>
                    {character.personaId === persona.id && (
                      <CheckCircle className="h-5 w-5 text-primary-500" />
                    )}
                  </div>
                  <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                    {persona.styleGuide.slice(0, 3).map((guide) => (
                      <li key={guide}>{guide}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CharacterSelect;
