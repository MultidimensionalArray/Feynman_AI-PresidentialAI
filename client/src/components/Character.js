import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, Target, RefreshCw } from 'lucide-react';
import VoiceControls from './VoiceControls';
import { defaultCharacterSelection, findAvatarById } from '../config/characterProfiles';

const Character = ({ 
  expression = 'friendly', 
  size = 'medium', 
  showAnimation = true,
  className = "" 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [characterAppearance, setCharacterAppearance] = useState(defaultCharacterSelection.customAppearance);

  // Load character appearance from localStorage
  const loadCharacterAppearance = () => {
    const savedCharacter = localStorage.getItem('characterSelection');
    if (savedCharacter) {
      const characterSelection = JSON.parse(savedCharacter);
      
      // If we have a custom appearance (like custom image), use that
      if (characterSelection.customAppearance) {
        setCharacterAppearance(characterSelection.customAppearance);
      } else {
        // Otherwise, use the default avatar appearance
        const avatar = findAvatarById(characterSelection.avatarId);
        setCharacterAppearance(avatar.appearance);
      }
    }
  };

  useEffect(() => {
    loadCharacterAppearance();
    
    // Listen for character selection changes
    const handleCharacterChange = () => {
      loadCharacterAppearance();
    };
    
    window.addEventListener('characterSelectionChanged', handleCharacterChange);
    
    return () => {
      window.removeEventListener('characterSelectionChanged', handleCharacterChange);
    };
  }, []);

  // Trigger animation when expression changes
  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [expression, showAnimation]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12';
      case 'medium':
        return 'w-16 h-16';
      case 'large':
        return 'w-24 h-24';
      case 'xl':
        return 'w-32 h-32';
      default:
        return 'w-16 h-16';
    }
  };

  const getExpression = () => {
    switch (expression) {
      case 'thinking':
        return {
          eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
          mouth: 'M 6 18 Q 10 16 14 18',
          eyebrow: 'M 6 8 Q 10 6 14 8'
        };
      case 'excited':
        return {
          eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
          mouth: 'M 6 20 Q 10 18 14 20',
          eyebrow: 'M 6 8 Q 10 6 14 8'
        };
      case 'encouraging':
        return {
          eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
          mouth: 'M 6 18 Q 10 20 14 18',
          eyebrow: 'M 6 8 Q 10 6 14 8'
        };
      case 'focused':
        return {
          eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
          mouth: 'M 6 18 Q 10 18 14 18',
          eyebrow: 'M 6 8 Q 10 6 14 8'
        };
      default: // friendly
        return {
          eyes: 'M 8 12 Q 8 10 10 10 Q 12 10 12 12',
          mouth: 'M 6 18 Q 10 20 14 18',
          eyebrow: 'M 6 8 Q 10 6 14 8'
        };
    }
  };

  const currentExpression = getExpression();

  // Check if this is a custom image character
  const isCustomImage = characterAppearance.imageUrl || (characterAppearance.customImage && characterAppearance.imageUrl);

  return (
    <div className={`relative ${getSizeClasses()} ${className}`}>
      {isCustomImage ? (
        // Custom image display
        <div className={`w-full h-full transition-all duration-500 ${
          isAnimating ? 'scale-110' : 'scale-100'
        } rounded-full overflow-hidden border-2 border-gray-200`}>
          <img
            src={characterAppearance.imageUrl}
            alt="Custom Mentor"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default character if image fails to load
              e.target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        // Default SVG character
        <svg
          viewBox="0 0 24 24"
          className={`w-full h-full transition-all duration-500 ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        {/* Head */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={characterAppearance.skinTone}
          stroke={characterAppearance.outlineColor}
          strokeWidth="1"
          className="transition-colors duration-300"
        />
        
        {/* Hair - Different styles based on character */}
        {characterAppearance.hairStyle === 'long' ? (
          <path
            d="M 3 8 Q 12 1 21 8 Q 20 6 12 6 Q 4 6 3 8 L 3 15 Q 12 12 21 15 L 21 8"
            fill={characterAppearance.hairColor}
            className="transition-all duration-300"
          />
        ) : characterAppearance.hairStyle === 'curly' ? (
          <path
            d="M 4 8 Q 12 2 20 8 Q 18 6 12 6 Q 6 6 4 8 M 5 9 Q 7 7 9 9 Q 8 8 7 8 Q 6 8 5 9 M 15 9 Q 17 7 19 9 Q 18 8 17 8 Q 16 8 15 9"
            fill={characterAppearance.hairColor}
            className="transition-all duration-300"
          />
        ) : characterAppearance.hairStyle === 'ponytail' ? (
          <>
            <path
              d="M 4 8 Q 12 2 20 8 Q 18 6 12 6 Q 6 6 4 8"
              fill={characterAppearance.hairColor}
              className="transition-all duration-300"
            />
            <path
              d="M 18 8 Q 20 10 18 12 Q 16 10 18 8"
              fill={characterAppearance.hairColor}
              className="transition-all duration-300"
            />
          </>
        ) : (
          <path
            d="M 4 8 Q 12 2 20 8 Q 18 6 12 6 Q 6 6 4 8"
            fill={characterAppearance.hairColor}
            className="transition-all duration-300"
          />
        )}
        
        {/* Eyebrows */}
        <path
          d={currentExpression.eyebrow}
          stroke={characterAppearance.hairColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300"
        />
        
        {/* Eyes */}
        <path
          d={currentExpression.eyes}
          stroke="#1F2937"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300"
        />
        
        {/* Eye pupils */}
        <circle cx="10" cy="12" r="1" fill="#1F2937" />
        <circle cx="14" cy="12" r="1" fill="#1F2937" />
        
        {/* Nose */}
        <circle cx="12" cy="14" r="0.5" fill={characterAppearance.outlineColor} />
        
        {/* Mouth */}
        <path
          d={currentExpression.mouth}
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300"
        />
        
        {/* Clothing - Different styles */}
        {characterAppearance.clothingStyle === 'dress' ? (
          <path
            d="M 8 20 Q 12 18 16 20 L 16 24 Q 12 22 8 24 Z"
            fill={characterAppearance.clothingColor}
            className="transition-colors duration-300"
          />
        ) : characterAppearance.clothingStyle === 'suit' ? (
          <>
            <rect
              x="8"
              y="20"
              width="8"
              height="3"
              fill={characterAppearance.clothingColor}
              rx="1"
              className="transition-colors duration-300"
            />
            <rect
              x="10"
              y="18"
              width="4"
              height="2"
              fill={characterAppearance.clothingColor}
              className="transition-colors duration-300"
            />
          </>
        ) : (
          <rect
            x="8"
            y="20"
            width="8"
            height="3"
            fill={characterAppearance.clothingColor}
            rx="1"
            className="transition-colors duration-300"
          />
        )}
        
        {/* Accessories */}
        {characterAppearance.accessory === 'glasses' && (
          <>
            <circle
              cx="10"
              cy="12"
              r="2.5"
              stroke={characterAppearance.accessoryColor}
              strokeWidth="1"
              fill="none"
              opacity="0.8"
            />
            <circle
              cx="14"
              cy="12"
              r="2.5"
              stroke={characterAppearance.accessoryColor}
              strokeWidth="1"
              fill="none"
              opacity="0.8"
            />
            <line
              x1="12.5"
              y1="12"
              x2="11.5"
              y2="12"
              stroke={characterAppearance.accessoryColor}
              strokeWidth="1"
              opacity="0.8"
            />
          </>
        )}
        
        {characterAppearance.accessory === 'earrings' && (
          <>
            <circle cx="6" cy="14" r="0.8" fill={characterAppearance.accessoryColor} />
            <circle cx="18" cy="14" r="0.8" fill={characterAppearance.accessoryColor} />
          </>
        )}
        
        {characterAppearance.accessory === 'hat' && (
          <path
            d="M 6 6 Q 12 3 18 6 Q 17 4 12 4 Q 7 4 6 6"
            fill={characterAppearance.accessoryColor}
            className="transition-colors duration-300"
          />
        )}
        
        {/* Glasses (optional, for the "smart" look) */}
        {expression === 'focused' && (
          <>
            <circle
              cx="10"
              cy="12"
              r="3"
              stroke="#6B7280"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <circle
              cx="14"
              cy="12"
              r="3"
              stroke="#6B7280"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <line
              x1="13"
              y1="12"
              x2="11"
              y2="12"
              stroke="#6B7280"
              strokeWidth="1"
              opacity="0.6"
            />
          </>
        )}
        
        {/* Thought bubble for thinking expression */}
        {expression === 'thinking' && (
          <g className="animate-pulse">
            <circle cx="18" cy="6" r="2" fill="#E5E7EB" opacity="0.8" />
            <circle cx="20" cy="4" r="1" fill="#E5E7EB" opacity="0.6" />
            <circle cx="22" cy="3" r="0.5" fill="#E5E7EB" opacity="0.4" />
          </g>
        )}
      </svg>
      )}
      
      {/* Floating elements for different expressions */}
      {expression === 'excited' && (
        <div className="absolute -top-2 -right-2 animate-bounce">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
        </div>
      )}
      
      {expression === 'encouraging' && (
        <div className="absolute -top-1 -right-1">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
        </div>
      )}
    </div>
  );
};

// Character with context (shows different expressions based on learning step)
export const LearningCharacter = ({ step, size = 'medium', className = "" }) => {
  const getExpressionForStep = (step) => {
    switch (step) {
      case 1:
        return 'friendly'; // Welcome and introduction
      case 2:
        return 'encouraging'; // Guiding through questions
      case 3:
        return 'focused'; // Analyzing and identifying gaps
      case 4:
        return 'excited'; // Celebrating completion
      default:
        return 'friendly';
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Brain className="w-4 h-4 text-blue-500" />;
      case 3:
        return <Target className="w-4 h-4 text-purple-500" />;
      case 4:
        return <RefreshCw className="w-4 h-4 text-green-500" />;
      default:
        return <Brain className="w-4 h-4 text-primary-500" />;
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <Character 
          expression={getExpressionForStep(step)} 
          size={size}
          showAnimation={true}
        />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          {getStepIcon(step)}
        </div>
      </div>
    </div>
  );
};

// Character with speech bubble
export const SpeakingCharacter = ({ 
  text, 
  expression = 'friendly', 
  size = 'medium',
  showVoiceControls = true,
  className = "" 
}) => {
  return (
    <div className={`flex items-start space-x-4 ${className}`}>
      <Character 
        expression={expression} 
        size={size}
        showAnimation={true}
      />
      
      <div className="flex-1 min-w-0">
        <div className="relative bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-200 p-4">
          {/* Speech bubble tail */}
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
          <div className="absolute -left-3 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-200"></div>
          
          <p className="text-gray-700 leading-relaxed mb-2">
            {text}
          </p>
          
          {showVoiceControls && (
            <div className="flex justify-end">
              <VoiceControls 
                text={text}
                showTTS={true}
                showRecognition={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Character;