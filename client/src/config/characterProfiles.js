const CUSTOM_GUIDES_KEY = 'customGuides';

export const historicalGuideOptions = [
  {
    id: 'albert_einstein',
    name: 'Albert Einstein',
    shortName: 'Einstein',
    tagline: 'Relativity pioneer who loves thought experiments.',
    introMessage:
      "Hello! I'm Albert Einstein. Let's explore this with curiosity and simple, vivid examples.",
    tone: 'Curious, playful, and precise.',
    encouragementStyle:
      'Uses thought experiments and gentle prompts to strengthen intuition.',
    styleGuide: [
      'Use simple analogies drawn from everyday experiences.',
      'Invite the learner to imagine "what if" scenarios.',
      'End with a short summary that returns to first principles.',
    ],
    voice: { rate: 0.95, pitch: 0.95, volume: 1, lang: 'en-US' },
  },
  {
    id: 'isaac_newton',
    name: 'Isaac Newton',
    shortName: 'Newton',
    tagline: 'Methodical thinker who builds ideas from clear laws.',
    introMessage:
      "Greetings. I'm Isaac Newton. We'll break this down into simple rules and build from there.",
    tone: 'Measured, logical, and grounded.',
    encouragementStyle:
      'Emphasizes structure, definitions, and careful reasoning.',
    styleGuide: [
      'Define key terms before using them.',
      'Explain cause and effect step by step.',
      'Use short summaries after each major point.',
    ],
    voice: { rate: 0.9, pitch: 0.9, volume: 1, lang: 'en-GB' },
  },
  {
    id: 'marie_curie',
    name: 'Marie Curie',
    shortName: 'Curie',
    tagline: 'Patient investigator who values evidence and clarity.',
    introMessage:
      "Hello, I'm Marie Curie. We'll keep this clear and grounded in real observations.",
    tone: 'Calm, encouraging, and careful.',
    encouragementStyle:
      'Highlights progress and invites the learner to check the evidence.',
    styleGuide: [
      'Connect ideas to tangible observations.',
      'Encourage curiosity about how we know something.',
      'Keep explanations concise and steady.',
    ],
    voice: { rate: 0.9, pitch: 1, volume: 1, lang: 'en-US' },
  },
  {
    id: 'galileo_galilei',
    name: 'Galileo Galilei',
    shortName: 'Galileo',
    tagline: 'Questioning observer who loves simple experiments.',
    introMessage:
      "Salve! I'm Galileo. Let's test this idea with simple examples you can picture.",
    tone: 'Curious, confident, and direct.',
    encouragementStyle:
      'Challenges assumptions and invites simple experiments.',
    styleGuide: [
      'Ask the learner to picture a simple experiment.',
      'Compare what we expect vs. what we observe.',
      'Use short, punchy sentences.',
    ],
    voice: { rate: 1, pitch: 1, volume: 1, lang: 'en-US' },
  },
  {
    id: 'ada_lovelace',
    name: 'Ada Lovelace',
    shortName: 'Ada',
    tagline: 'Analytical visionary who blends logic with imagination.',
    introMessage:
      "Hello! I'm Ada Lovelace. We'll organize this clearly and keep the ideas elegant.",
    tone: 'Analytical, imaginative, and polished.',
    encouragementStyle:
      'Uses structure and metaphors to reveal the hidden pattern.',
    styleGuide: [
      'Outline the idea as a sequence of steps.',
      'Use a metaphor to make the structure memorable.',
      'Close with a concise recap.',
    ],
    voice: { rate: 0.98, pitch: 1.05, volume: 1, lang: 'en-GB' },
  },
  {
    id: 'leonardo_da_vinci',
    name: 'Leonardo da Vinci',
    shortName: 'Leonardo',
    tagline: 'Curious artist-engineer who connects ideas across fields.',
    introMessage:
      "Ciao! I'm Leonardo. We'll explore this by connecting ideas across art, nature, and design.",
    tone: 'Imaginative, inquisitive, and descriptive.',
    encouragementStyle:
      'Encourages visual thinking and cross-domain connections.',
    styleGuide: [
      'Describe the idea with a vivid mental picture.',
      'Connect the concept to a craft or real-world tool.',
      'Wrap up with a creative analogy.',
    ],
    voice: { rate: 1.02, pitch: 1.05, volume: 1, lang: 'en-US' },
  },
  {
    id: 'socrates',
    name: 'Socrates',
    shortName: 'Socrates',
    tagline: 'Socratic guide who learns by asking the right questions.',
    introMessage:
      "Greetings. I'm Socrates. We'll examine this together by asking simple, honest questions.",
    tone: 'Patient, probing, and reflective.',
    encouragementStyle:
      'Asks clarifying questions that help the learner refine their ideas.',
    styleGuide: [
      'Use questions to reveal assumptions.',
      'Keep explanations humble and focused.',
      'Summarize what the learner has discovered.',
    ],
    voice: { rate: 0.92, pitch: 0.95, volume: 1, lang: 'en-GB' },
  },
];

export const avatarPresets = [
  {
    id: 'mentor_classic',
    label: 'Mentor Classic',
    appearance: {
      skinTone: '#FDE68A',
      hairColor: '#92400E',
      outlineColor: '#F59E0B',
      clothingColor: '#2563EB',
      accentColor: '#1D4ED8',
      accessoryColor: '#A855F7',
      backgroundColor: '#EFF6FF',
      hairStyle: 'classic',
      clothingStyle: 'shirt',
      accessory: 'glasses',
    },
  },
  {
    id: 'lab_explorer',
    label: 'Lab Explorer',
    appearance: {
      skinTone: '#F8D7A6',
      hairColor: '#1F2937',
      outlineColor: '#2563EB',
      clothingColor: '#10B981',
      accentColor: '#34D399',
      accessoryColor: '#3B82F6',
      backgroundColor: '#ECFDF5',
      hairStyle: 'classic',
      clothingStyle: 'shirt',
      accessory: 'glasses',
    },
  },
  {
    id: 'coach_dynamic',
    label: 'Coach Dynamic',
    appearance: {
      skinTone: '#FAD1C8',
      hairColor: '#111827',
      outlineColor: '#F97316',
      clothingColor: '#F97316',
      accentColor: '#FB923C',
      accessoryColor: '#FBBF24',
      backgroundColor: '#FFF7ED',
      hairStyle: 'classic',
      clothingStyle: 'suit',
      accessory: 'hat',
    },
  },
  {
    id: 'storyteller_bold',
    label: 'Storyteller Bold',
    appearance: {
      skinTone: '#FCD34D',
      hairColor: '#4C1D95',
      outlineColor: '#8B5CF6',
      clothingColor: '#8B5CF6',
      accentColor: '#6366F1',
      accessoryColor: '#F472B6',
      backgroundColor: '#F5F3FF',
      hairStyle: 'curly',
      clothingStyle: 'dress',
      accessory: 'earrings',
    },
  },
  {
    id: 'girl_mentor',
    label: 'Girl Mentor',
    appearance: {
      skinTone: '#F8D7A6',
      hairColor: '#7C2D12',
      outlineColor: '#DC2626',
      clothingColor: '#7C3AED',
      accentColor: '#A855F7',
      accessoryColor: '#F472B6',
      backgroundColor: '#FDF4FF',
      hairStyle: 'long',
      clothingStyle: 'dress',
      accessory: 'earrings',
    },
  },
  {
    id: 'wise_elder',
    label: 'Wise Elder',
    appearance: {
      skinTone: '#FDE68A',
      hairColor: '#6B7280',
      outlineColor: '#8B5CF6',
      clothingColor: '#1E40AF',
      accentColor: '#3B82F6',
      accessoryColor: '#F59E0B',
      backgroundColor: '#EFF6FF',
      hairStyle: 'curly',
      clothingStyle: 'suit',
      accessory: 'glasses',
    },
  },
  {
    id: 'tech_guru',
    label: 'Tech Guru',
    appearance: {
      skinTone: '#FAD1C8',
      hairColor: '#1F2937',
      outlineColor: '#10B981',
      clothingColor: '#1F2937',
      accentColor: '#10B981',
      accessoryColor: '#3B82F6',
      backgroundColor: '#F0FDF4',
      hairStyle: 'classic',
      clothingStyle: 'suit',
      accessory: 'glasses',
    },
  },
  {
    id: 'creative_artist',
    label: 'Creative Artist',
    appearance: {
      skinTone: '#FCD34D',
      hairColor: '#7C2D12',
      outlineColor: '#F59E0B',
      clothingColor: '#EC4899',
      accentColor: '#F472B6',
      accessoryColor: '#8B5CF6',
      backgroundColor: '#FDF2F8',
      hairStyle: 'curly',
      clothingStyle: 'dress',
      accessory: 'earrings',
    },
  },
  {
    id: 'gentle_teacher',
    label: 'Gentle Teacher',
    appearance: {
      skinTone: '#F8D7A6',
      hairColor: '#92400E',
      outlineColor: '#059669',
      clothingColor: '#059669',
      accentColor: '#10B981',
      accessoryColor: '#F59E0B',
      backgroundColor: '#F0FDF4',
      hairStyle: 'ponytail',
      clothingStyle: 'dress',
      accessory: 'glasses',
    },
  },
  {
    id: 'energetic_coach',
    label: 'Energetic Coach',
    appearance: {
      skinTone: '#FAD1C8',
      hairColor: '#111827',
      outlineColor: '#DC2626',
      clothingColor: '#DC2626',
      accentColor: '#F97316',
      accessoryColor: '#FBBF24',
      backgroundColor: '#FEF2F2',
      hairStyle: 'classic',
      clothingStyle: 'suit',
      accessory: 'hat',
    },
  },
  {
    id: 'mystical_guide',
    label: 'Mystical Guide',
    appearance: {
      skinTone: '#FDE68A',
      hairColor: '#4C1D95',
      outlineColor: '#7C3AED',
      clothingColor: '#4C1D95',
      accentColor: '#7C3AED',
      accessoryColor: '#F472B6',
      backgroundColor: '#F5F3FF',
      hairStyle: 'long',
      clothingStyle: 'dress',
      accessory: 'hat',
    },
  },
  {
    id: 'custom_image',
    label: 'Custom Image',
    appearance: {
      skinTone: '#FDE68A',
      hairColor: '#92400E',
      outlineColor: '#F59E0B',
      clothingColor: '#2563EB',
      accentColor: '#1D4ED8',
      accessoryColor: '#A855F7',
      backgroundColor: '#EFF6FF',
      hairStyle: 'classic',
      clothingStyle: 'shirt',
      accessory: null,
      customImage: true,
    },
  },
];

export const personaToAvatarMap = {
  albert_einstein: 'wise_elder',
  isaac_newton: 'lab_explorer',
  marie_curie: 'gentle_teacher',
  galileo_galilei: 'mentor_classic',
  ada_lovelace: 'tech_guru',
  leonardo_da_vinci: 'creative_artist',
  socrates: 'mystical_guide',
};

const normalizeGuide = (guide) => {
  if (!guide) return null;
  const styleGuide = Array.isArray(guide.styleGuide)
    ? guide.styleGuide
    : (guide.styleGuide || '')
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    ...guide,
    styleGuide,
    voice: guide.voice || { rate: 0.95, pitch: 1, volume: 1, lang: 'en-US' },
  };
};

export const loadCustomGuides = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_GUIDES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeGuide).filter(Boolean);
  } catch (error) {
    console.warn('Failed to load custom guides', error);
    return [];
  }
};

export const saveCustomGuides = (guides) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CUSTOM_GUIDES_KEY, JSON.stringify(guides));
  } catch (error) {
    console.warn('Failed to save custom guides', error);
  }
};

export const getPersonaOptions = () => [
  ...historicalGuideOptions.map(normalizeGuide),
  ...loadCustomGuides(),
];

export const defaultPersonaId = historicalGuideOptions[0].id;

export const findPersonaById = (id) =>
  getPersonaOptions().find((persona) => persona.id === id) ||
  normalizeGuide(historicalGuideOptions[0]);

export const findAvatarById = (id) =>
  avatarPresets.find((avatar) => avatar.id === id) || avatarPresets[0];

export const getDefaultAvatarForPersona = (personaId) => {
  const avatarId = personaToAvatarMap[personaId] || 'mentor_classic';
  return findAvatarById(avatarId);
};

const defaultAvatar = getDefaultAvatarForPersona(defaultPersonaId);

export const defaultCharacterSelection = {
  personaId: defaultPersonaId,
  avatarId: defaultAvatar.id,
  customAppearance: defaultAvatar.appearance,
};
