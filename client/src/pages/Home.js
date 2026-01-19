import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Lightbulb, Target, RefreshCw, ArrowRight } from 'lucide-react';
import { SpeakingCharacter, LearningCharacter } from '../components/Character';
import { defaultCharacterSelection, findPersonaById } from '../config/characterProfiles';

const Home = () => {
  const [characterKey, setCharacterKey] = useState(0);
  const [characterContext, setCharacterContext] = useState(null);

  // Load character context and listen for changes
  useEffect(() => {
    const loadCharacterContext = () => {
      const savedCharacter = localStorage.getItem('characterSelection');
      if (savedCharacter) {
        const characterSelection = JSON.parse(savedCharacter);
        const persona = findPersonaById(characterSelection.personaId);
        setCharacterContext(persona);
      } else {
        const defaultPersona = findPersonaById(defaultCharacterSelection.personaId);
        setCharacterContext(defaultPersona);
      }
    };
    
    loadCharacterContext();
    
    const handleCharacterChange = () => {
      loadCharacterContext();
      setCharacterKey(prev => prev + 1);
    };
    
    window.addEventListener('characterSelectionChanged', handleCharacterChange);
    
    return () => {
      window.removeEventListener('characterSelectionChanged', handleCharacterChange);
    };
  }, []);

  const steps = [
    {
      number: 1,
      title: "Choose a Topic",
      description: "Pick any concept you want to understand better",
      icon: Target,
      color: "text-blue-600"
    },
    {
      number: 2,
      title: "Explain Simply",
      description: "Teach it as if explaining to a child",
      icon: Lightbulb,
      color: "text-green-600"
    },
    {
      number: 3,
      title: "Identify Gaps",
      description: "Find areas where your understanding is unclear",
      icon: Brain,
      color: "text-purple-600"
    },
    {
      number: 4,
      title: "Review & Simplify",
      description: "Go back and fill in the gaps with simple explanations",
      icon: RefreshCw,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 gradient-header rounded-full flex items-center justify-center shadow-lg">
            <LearningCharacter key={characterKey} step={1} size="xl" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Hi! I'm your Feynman Learning Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          I use the Feynman Technique to explain complex topics in simple terms. Ask me anything you want to understand better!
        </p>
        
        {/* Character Introduction */}
        <div className="max-w-2xl mx-auto mb-8">
          <SpeakingCharacter
            key={`intro-${characterKey}`}
            text={characterContext ? characterContext.introMessage : "Hi! I'm your learning guide. I'll help you master any topic using the Feynman Technique. Together, we'll break down complex concepts into simple, understandable pieces. Ready to start learning?"}
            expression="friendly"
            size="medium"
            showVoiceControls={true}
          />
        </div>
        
        <Link
          to="/learn"
          className="inline-flex items-center space-x-2 gradient-button text-white font-medium text-lg px-8 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200"
        >
          <span>Start Learning with {characterContext ? characterContext.shortName : 'your guide'}</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How the Feynman Technique Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-100">
                    <IconComponent className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600">
            AI-powered guidance for effective learning
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI-Powered Explanations
            </h3>
            <p className="text-gray-600">
              Get clear, simple explanations tailored to your learning level
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Gap Identification
            </h3>
            <p className="text-gray-600">
              Discover exactly where your understanding needs improvement
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Interactive Learning
            </h3>
            <p className="text-gray-600">
              Engage with questions and exercises to test your understanding
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 text-center">
        <div className="max-w-2xl mx-auto mb-8">
          <SpeakingCharacter
            key={`cta-${characterKey}`}
            text={characterContext ? `Ready to become a master of any topic? Let's start your learning journey together! I'll be with you every step of the way, making complex concepts simple and fun to understand.` : "Ready to become a master of any topic? Let's start your learning journey together! I'll be with you every step of the way, making complex concepts simple and fun to understand."}
            expression="excited"
            size="medium"
            showVoiceControls={true}
          />
        </div>
        <Link
          to="/learn"
          className="inline-flex items-center space-x-2 gradient-button text-white font-medium text-lg px-8 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200"
        >
          <span>Begin Learning with {characterContext ? characterContext.shortName : 'your guide'}</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
