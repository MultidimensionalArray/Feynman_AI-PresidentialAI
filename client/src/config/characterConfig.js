// Character Configuration
// This file makes it easy to update and customize the character

export const characterConfig = {
  // Basic appearance
  appearance: {
    skinColor: '#FEF3C7',
    skinBorderColor: '#F59E0B',
    hairColor: '#92400E',
    eyeColor: '#1F2937',
    mouthColor: '#DC2626',
    noseColor: '#F59E0B'
  },

  // Expressions and their visual properties
  expressions: {
    friendly: {
      eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
      mouth: 'M 6 18 Q 10 20 14 18',
      eyebrow: 'M 6 8 Q 10 6 14 8',
      description: 'Warm and welcoming'
    },
    thinking: {
      eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
      mouth: 'M 6 18 Q 10 16 14 18',
      eyebrow: 'M 6 8 Q 10 6 14 8',
      description: 'Contemplative and focused',
      specialEffects: ['thoughtBubble']
    },
    excited: {
      eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
      mouth: 'M 6 20 Q 10 18 14 20',
      eyebrow: 'M 6 8 Q 10 6 14 8',
      description: 'Enthusiastic and energetic',
      specialEffects: ['sparkle']
    },
    encouraging: {
      eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
      mouth: 'M 6 18 Q 10 20 14 18',
      eyebrow: 'M 6 8 Q 10 6 14 8',
      description: 'Supportive and motivating',
      specialEffects: ['glow']
    },
    focused: {
      eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
      mouth: 'M 6 18 Q 10 18 14 18',
      eyebrow: 'M 6 8 Q 10 6 14 8',
      description: 'Concentrated and analytical',
      specialEffects: ['glasses']
    }
  },

  // Size configurations
  sizes: {
    small: { width: 'w-12', height: 'h-12', viewBox: '0 0 24 24' },
    medium: { width: 'w-16', height: 'h-16', viewBox: '0 0 24 24' },
    large: { width: 'w-24', height: 'h-24', viewBox: '0 0 24 24' },
    xl: { width: 'w-32', height: 'h-32', viewBox: '0 0 24 24' }
  },

  // Step-based expressions for learning flow
  stepExpressions: {
    1: 'friendly',    // Welcome and introduction
    2: 'encouraging', // Guiding through questions
    3: 'focused',     // Analyzing and identifying gaps
    4: 'excited'      // Celebrating completion
  },

  // Step icons
  stepIcons: {
    1: { icon: 'Lightbulb', color: 'text-yellow-500' },
    2: { icon: 'Brain', color: 'text-blue-500' },
    3: { icon: 'Target', color: 'text-purple-500' },
    4: { icon: 'RefreshCw', color: 'text-green-500' }
  },

  // Animation settings
  animations: {
    duration: 500,
    scale: {
      normal: 'scale-100',
      animated: 'scale-110'
    },
    bounce: {
      duration: 1000,
      delay: 0
    }
  },

  // Speech bubble styling
  speechBubble: {
    backgroundColor: 'bg-white',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    shadow: 'shadow-sm',
    borderRadius: 'rounded-2xl',
    tailSize: 8
  }
};

// Helper functions for character customization
export const getExpressionForStep = (step) => {
  return characterConfig.stepExpressions[step] || 'friendly';
};

export const getStepIcon = (step) => {
  return characterConfig.stepIcons[step] || { icon: 'Brain', color: 'text-primary-500' };
};

export const getSizeClasses = (size) => {
  const sizeConfig = characterConfig.sizes[size] || characterConfig.sizes.medium;
  return `${sizeConfig.width} ${sizeConfig.height}`;
};

// Character personality traits
export const characterPersonality = {
  name: 'Alex',
  role: 'Learning Guide',
  traits: [
    'Patient and encouraging',
    'Knowledgeable but approachable',
    'Enthusiastic about learning',
    'Supportive and non-judgmental'
  ],
  catchphrases: [
    "Let's break this down together!",
    "Great thinking!",
    "You're doing amazing!",
    "Let's explore this step by step.",
    "I'm here to help you understand!"
  ]
};

// Easy character updates - just modify these values
export const easyUpdates = {
  // Change the character's name
  characterName: 'Alex',
  
  // Change the main colors (affects the entire character)
  primaryColor: '#F59E0B',  // Orange - warm and friendly
  secondaryColor: '#92400E', // Brown - for hair and details
  
  // Change the character's role
  role: 'Learning Guide',
  
  // Enable/disable features
  features: {
    animations: true,
    expressions: true,
    speechBubbles: true,
    stepIcons: true
  }
};