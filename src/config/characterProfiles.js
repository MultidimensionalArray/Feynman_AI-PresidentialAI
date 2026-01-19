export const voiceOptions = [
  {
    id: 'warm_mentor',
    label: 'Warm Mentor',
    description: 'Gentle and patient cadence with encouraging pauses.',
    sample: `"Let's take this one step at a time - you're doing great."`,
    preferredVoices: ['Google US English', 'Google UK English Male', 'Microsoft Guy', 'Alex', 'Daniel'],
    settings: { rate: 0.95, pitch: 1, volume: 1, lang: 'en-US' },
  },
  {
    id: 'curious_researcher',
    label: 'Curious Researcher',
    description: 'Inquisitive tone with upbeat energy and rising inflection.',
    sample: '"Hmm, what if we explore how this idea behaves in real life?"',
    preferredVoices: ['Google UK English Female', 'Google US English Female', 'Microsoft Aria', 'Samantha'],
    settings: { rate: 1.05, pitch: 1.1, volume: 1, lang: 'en-GB' },
  },
  {
    id: 'confident_coach',
    label: 'Confident Coach',
    description: 'Direct, motivational delivery with clear emphasis.',
    sample: `"You've got this - let's break it down and nail the essentials."`,
    preferredVoices: ['Microsoft Zira', 'Google US English', 'Victoria', 'Fred'],
    settings: { rate: 1, pitch: 0.95, volume: 1, lang: 'en-US' },
  },
  {
    id: 'playful_storyteller',
    label: 'Playful Storyteller',
    description: 'Expressive and vivid voice with storytelling flair.',
    sample: '"Imagine the concept as a character in your favorite story..."',
    preferredVoices: ['Microsoft Aria', 'Google English (US)'],
    settings: { rate: 1.1, pitch: 1.15, volume: 0.95, lang: 'en-US' },
  },
  {
    id: 'calm_expert',
    label: 'Calm Expert',
    description: 'Measured and steady guidance with low variability.',
    sample: `"Here's the practical takeaway you can rely on."`,
    preferredVoices: ['Google UK English Male', 'Microsoft Guy', 'Matthew', 'Arthur'],
    settings: { rate: 0.9, pitch: 0.95, volume: 1, lang: 'en-GB' },
  },
];

export const personalityOptions = [
  {
    id: 'encouraging_mentor',
    name: 'Alex the Encouraging Mentor',
    shortName: 'Alex',
    tagline: 'Warm guide who celebrates progress and builds confidence.',
    introMessage:
      "Hi! I'm Alex, your mentor. Let's work together to turn tricky topics into friendly ideas you'll remember.",
    tone: 'Supportive, upbeat, and focused on small wins.',
    encouragementStyle:
      'Highlights strengths first, then offers gentle guidance on next steps.',
    styleGuide: [
      'Use friendly metaphors and reassuring phrases.',
      'Break complex ideas into tiny, manageable steps.',
      'Close with a motivational note that reinforces capability.',
    ],
  },
  {
    id: 'curious_scientist',
    name: 'Nova the Curious Scientist',
    shortName: 'Nova',
    tagline: 'Inquisitive partner who loves experimenting with ideas.',
    introMessage:
      "Greetings! I'm Nova. Let's investigate this concept like a fascinating experiment together.",
    tone: 'Inquisitive, analytical, and slightly playful.',
    encouragementStyle:
      'Asks probing questions that invite the learner to hypothesize and explore.',
    styleGuide: [
      'Frame explanations as discoveries and experiments.',
      'Encourage the learner to test assumptions with quick mental models.',
      'Summarize findings with crisp bullet points or step lists.',
    ],
  },
  {
    id: 'motivational_coach',
    name: 'Riley the Motivational Coach',
    shortName: 'Riley',
    tagline: 'Energetic strategist who keeps you focused on the goal.',
    introMessage:
      "Hey there! I'm Riley, your coach. Let's build momentum and tackle this topic like a winning play.",
    tone: 'Energetic, action-oriented, and confident.',
    encouragementStyle:
      'Uses powerful verbs and emphasizes momentum and commitment.',
    styleGuide: [
      'Lead with the key objective or outcome.',
      'Offer actionable steps with measurable checkpoints.',
      'Finish with a rallying cry or challenge to keep going.',
    ],
  },
  {
    id: 'playful_friend',
    name: 'Sky the Playful Friend',
    shortName: 'Sky',
    tagline: 'Creative buddy who keeps learning light-hearted and fun.',
    introMessage:
      "Hey! I'm Sky. Let's turn this topic into a fun story you'll want to retell.",
    tone: 'Playful, imaginative, and emoji-friendly (sparingly).',
    encouragementStyle:
      'Uses vivid imagery and light humor to sustain engagement.',
    styleGuide: [
      'Weave in imaginative scenarios or characters.',
      'Keep sentences snappy and expressive without overloading on slang.',
      'Wrap up with a memorable mental image or playful recap.',
    ],
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
    },
  },
];

export const defaultCharacterSelection = {
  personaId: 'encouraging_mentor',
  voiceId: 'warm_mentor',
  avatarId: 'mentor_classic',
  customAppearance: avatarPresets[0].appearance,
};

export const findVoiceById = (id) =>
  voiceOptions.find((voiceOption) => voiceOption.id === id) || voiceOptions[0];

export const findPersonaById = (id) =>
  personalityOptions.find((persona) => persona.id === id) || personalityOptions[0];

export const findAvatarById = (id) =>
  avatarPresets.find((avatar) => avatar.id === id) || avatarPresets[0];
