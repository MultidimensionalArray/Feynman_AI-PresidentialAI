import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  avatarPresets,
  defaultCharacterSelection,
  findAvatarById,
  findPersonaById,
  findVoiceById,
  personalityOptions,
  voiceOptions,
} from '../config/characterProfiles';

const STORAGE_KEY = 'feynmanCharacterSelection';

const CharacterContext = createContext(null);

const loadInitialSelection = () => {
  if (typeof window === 'undefined') {
    return {
      ...defaultCharacterSelection,
      customAppearance: { ...defaultCharacterSelection.customAppearance },
    };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultCharacterSelection,
        ...parsed,
        customAppearance: {
          ...findAvatarById(parsed.avatarId)?.appearance,
          ...parsed.customAppearance,
        },
      };
    }
  } catch (error) {
    console.warn('Failed to load stored character selection', error);
  }

  return {
    ...defaultCharacterSelection,
    customAppearance: { ...defaultCharacterSelection.customAppearance },
  };
};

export const CharacterProvider = ({ children }) => {
  const [selection, setSelection] = useState(loadInitialSelection);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch (error) {
      console.warn('Failed to persist character selection', error);
    }
  }, [selection]);

  const characterDetails = useMemo(() => {
    const persona = findPersonaById(selection.personaId);
    const voice = findVoiceById(selection.voiceId);
    const avatar = findAvatarById(selection.avatarId);

    const appearance = {
      ...avatar.appearance,
      ...(selection.customAppearance || {}),
    };

    return {
      persona,
      voice,
      avatar,
      appearance,
    };
  }, [selection]);

  const updateSelection = React.useCallback((updates) => {
    setSelection((prev) => {
      const next = { ...prev, ...updates };
      if (updates.customAppearance) {
        next.customAppearance = {
          ...(prev.customAppearance || {}),
          ...updates.customAppearance,
        };
      }
      return next;
    });
  }, []);

  const resetToDefault = React.useCallback(() => {
    setSelection({
      ...defaultCharacterSelection,
      customAppearance: { ...defaultCharacterSelection.customAppearance },
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      character: {
        ...selection,
        ...characterDetails,
      },
      updateSelection,
      resetToDefault,
      options: {
        voices: voiceOptions,
        personas: personalityOptions,
        avatars: avatarPresets,
      },
    }),
    [selection, characterDetails, updateSelection, resetToDefault],
  );

  return <CharacterContext.Provider value={contextValue}>{children}</CharacterContext.Provider>;
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
