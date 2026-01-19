import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, Info, Moon, Settings, Sun, BookMarked } from 'lucide-react';
import VoiceSettings from './VoiceSettings';

const Header = () => {
  const location = useLocation();
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = stored ? stored === 'dark' : prefersDark;
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="gradient-header shadow-lg">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-white" />
              <div className="text-white">
                <span className="text-xl font-bold block">Feynman Chatbot</span>
                <span className="text-sm opacity-90">Learn through simple explanations</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-white bg-white bg-opacity-20' 
                    : 'text-white hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/learn"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/learn') 
                    ? 'text-white bg-white bg-opacity-20' 
                    : 'text-white hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Brain className="h-4 w-4" />
                <span>Start Learning</span>
              </Link>
              
              <Link
                to="/review"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/review')
                    ? 'text-white bg-white bg-opacity-20'
                    : 'text-white hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>

              <Link
                to="/about"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about') 
                    ? 'text-white bg-white bg-opacity-20' 
                    : 'text-white hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <BookMarked className="h-4 w-4" />
                <span>Review</span>
              </Link>
            </nav>

            <div className="ml-auto flex items-center space-x-2">
              <button
                onClick={() => {
                  const nextMode = !isDarkMode;
                  setIsDarkMode(nextMode);
                  document.documentElement.classList.toggle('dark', nextMode);
                  localStorage.setItem('theme', nextMode ? 'dark' : 'light');
                }}
                className="p-2 text-white hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setShowVoiceSettings(true)}
                className="p-2 text-white hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                title="Guide Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
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
