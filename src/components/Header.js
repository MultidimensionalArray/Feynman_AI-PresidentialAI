import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, Info, Settings, Sparkles } from 'lucide-react';
import VoiceSettings from './VoiceSettings';
import { useCharacter } from '../context/CharacterContext';

const Header = () => {
  const location = useLocation();
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const { character } = useCharacter();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gradient">Feynman Learning</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/learn"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/learn') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Brain className="h-4 w-4" />
                <span>Start Learning</span>
              </Link>
              
              <Link
                to="/about"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>

              <Link
                to="/companion"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/companion') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{character.persona?.name?.split(' ')[0] || 'Companion'}</span>
              </Link>
            </nav>

            {/* Voice Settings Button */}
            <button
              onClick={() => setShowVoiceSettings(true)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Voice Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Voice Settings Modal */}
      <VoiceSettings 
        isOpen={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />
    </>
  );
};

export default Header;
