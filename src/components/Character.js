import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, Target, RefreshCw } from 'lucide-react';
import VoiceControls from './VoiceControls';
import { useCharacter } from '../context/CharacterContext';

const defaultAppearance = {
  skinTone: '#FEF3C7',
  outlineColor: '#F59E0B',
  hairColor: '#92400E',
  accentColor: '#DC2626',
  accessoryColor: '#6B7280',
  backgroundColor: '#EFF6FF',
};

const Character = ({ 
  expression = 'friendly', 
  size = 'medium', 
  showAnimation = true,
  className = "",
  appearance = defaultAppearance,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const palette = {
    ...defaultAppearance,
    ...(appearance || {}),
  };

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

  return (
    <div className={`relative ${getSizeClasses()} ${className}`}>
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
          fill={palette.skinTone}
          stroke={palette.outlineColor}
          strokeWidth="1"
          className="transition-colors duration-300"
        />
        
        {/* Hair */}
        <path
          d="M 4 8 Q 12 2 20 8 Q 18 6 12 6 Q 6 6 4 8"
          fill={palette.hairColor}
          className="transition-all duration-300"
        />
        
        {/* Eyebrows */}
        <path
          d={currentExpression.eyebrow}
          stroke={palette.hairColor}
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
        <circle cx="12" cy="14" r="0.5" fill={palette.outlineColor} />
        
        {/* Mouth */}
        <path
          d={currentExpression.mouth}
          stroke={palette.accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300"
        />
        
        {/* Glasses (optional, for the "smart" look) */}
        {expression === 'focused' && (
          <>
            <circle
              cx="10"
              cy="12"
              r="3"
              stroke={palette.accessoryColor}
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <circle
              cx="14"
              cy="12"
              r="3"
              stroke={palette.accessoryColor}
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <line
              x1="13"
              y1="12"
              x2="11"
              y2="12"
              stroke={palette.accessoryColor}
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
  const { character: activeCharacter } = useCharacter();

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
          appearance={activeCharacter?.appearance}
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
  const { character: activeCharacter } = useCharacter();

  return (
    <div className={`flex items-start space-x-4 ${className}`}>
      <Character 
        expression={expression} 
        size={size}
        showAnimation={true}
        appearance={activeCharacter?.appearance}
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
