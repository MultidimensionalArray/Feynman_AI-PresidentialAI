import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Brain, Lightbulb, Target, RefreshCw, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { feynmanAPI } from '../services/api';
import GuidedQuestions from '../components/GuidedQuestions';
import ConversationalQuestions from '../components/ConversationalQuestions';
import VoiceControls from '../components/VoiceControls';
import { SpeakingCharacter, LearningCharacter } from '../components/Character';
import { defaultCharacterSelection, findPersonaById } from '../config/characterProfiles';

const Session = () => {
  const { topic } = useParams();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'beginner';
  const reviewStorageKey = 'feynmanSessionReviews';

  // Helper function to format text content into structured sections
  const formatContent = (text) => {
    if (!text) return null;
    
    // Split by common section markers
    const sections = text.split(/\n\s*\n/).filter(section => section.trim());
    const formattedSections = [];
    
    sections.forEach((section, index) => {
      const trimmedSection = section.trim();
      const lines = trimmedSection.split('\n').map(line => line.trim()).filter(Boolean);
      const bulletLineRegex = /^[•\-*]\s+/;
      const numberLineRegex = /^\d+\.\s+/;
      const isBulletLine = (line) => bulletLineRegex.test(line);
      const isNumberedLine = (line) => numberLineRegex.test(line);
      const bulletLines = lines.filter(isBulletLine);
      const numberedLines = lines.filter(isNumberedLine);
      const hasBulletList = bulletLines.length > 1;
      const hasNumberedList = numberedLines.length > 1;
      
      // Check if it's a bullet point list
      if (hasBulletList) {
        const title = !isBulletLine(lines[0]) ? lines[0].replace(/[•\-*]\s*/, '').trim() : '';
        const itemLines = title ? lines.slice(1) : lines;
        const items = itemLines
          .filter(isBulletLine)
          .map(line => line.replace(/[•\-*]\s*/, '').trim())
          .filter(item => item);
        
        formattedSections.push({
          type: 'list',
          title: title,
          items: items
        });
      }
      // Check if it's a numbered list
      else if (hasNumberedList) {
        const title = !isNumberedLine(lines[0]) ? lines[0].replace(/^\d+\.\s*/, '').trim() : '';
        const itemLines = title ? lines.slice(1) : lines;
        const items = itemLines
          .filter(isNumberedLine)
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(item => item);
        
        formattedSections.push({
          type: 'numbered',
          title: title,
          items: items
        });
      }
      // Check if it's a header (starts with ** or ##)
      else if (trimmedSection.startsWith('## ')) {
        const title = trimmedSection.replace(/^##\s*/, '').trim();
        formattedSections.push({
          type: 'header',
          title: title,
          content: ''
        });
      }
      // Regular paragraph
      else {
        formattedSections.push({
          type: 'paragraph',
          content: trimmedSection
        });
      }
    });
    
    return formattedSections;
  };

  const saveGapsReview = (topicLabel, gapsText) => {
    if (!topicLabel || !gapsText) return;
    try {
      const raw = localStorage.getItem(reviewStorageKey);
      const existing = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const latestIndex = existing.findIndex(
        (item) => item.topic === topicLabel,
      );
      const latestEntry = latestIndex >= 0 ? existing[latestIndex] : null;
      const recentWindowMs = 5 * 60 * 1000;

      const entry = {
        id: `${Date.now()}`,
        topic: topicLabel,
        gaps: gapsText,
        createdAt: new Date(now).toISOString(),
      };
      if (latestEntry && now - new Date(latestEntry.createdAt).getTime() < recentWindowMs) {
        const updated = [...existing];
        updated[latestIndex] = entry;
        localStorage.setItem(reviewStorageKey, JSON.stringify(updated));
      } else {
        localStorage.setItem(reviewStorageKey, JSON.stringify([entry, ...existing]));
      }
    } catch (error) {
      console.warn('Failed to save review entry', error);
    }
  };

  // Component to render structured content
  const StructuredContent = ({ content, className = "" }) => {
    const sections = formatContent(content);
    
    if (!sections || sections.length === 0) {
      return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
      );
    }

    return (
      <div className={`space-y-4 ${className}`}>
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {section.type === 'header' && (
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                {section.title}
              </h3>
            )}
            
            {section.type === 'list' && (
              <div>
                {section.title && (
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1.5">•</span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {section.type === 'numbered' && (
              <div>
                {section.title && (
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {section.title}
                  </h3>
                )}
                <ol className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                        {itemIndex + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            
            {section.type === 'paragraph' && (
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userExplanation, setUserExplanation] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [knowledgeGaps, setKnowledgeGaps] = useState('');
  const [questions, setQuestions] = useState([]);
  const [guidedQuestions, setGuidedQuestions] = useState([]);
  const [refinedExplanation, setRefinedExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [isPreparingQuestions, setIsPreparingQuestions] = useState(false);
  const [isFinalizingOutput, setIsFinalizingOutput] = useState(false);
  const [isAnalyzingGaps, setIsAnalyzingGaps] = useState(false);
  const [error, setError] = useState('');
  const [characterContext, setCharacterContext] = useState(null);
  const [useConversationalMode, setUseConversationalMode] = useState(true);

  const steps = [
    { number: 1, title: "Simple Explanation", icon: Lightbulb, color: "text-green-600" },
    { number: 2, title: "Your Explanation", icon: Brain, color: "text-blue-600" },
    { number: 3, title: "Identify Gaps", icon: Target, color: "text-purple-600" },
    { number: 4, title: "Review", icon: RefreshCw, color: "text-orange-600" }
  ];

  // Load character context
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
    
    // Listen for character selection changes
    const handleCharacterChange = () => {
      loadCharacterContext();
    };
    
    window.addEventListener('characterSelectionChanged', handleCharacterChange);
    
    return () => {
      window.removeEventListener('characterSelectionChanged', handleCharacterChange);
    };
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      generateSimpleExplanation();
    }
  }, [topic, level]);

  const generateSimpleExplanation = async () => {
    setIsGeneratingExplanation(true);
    setIsFinalizingOutput(false);
    setError('');
    try {
      const response = await feynmanAPI.generateExplanation(topic, level, characterContext);
      const text = response.explanation || '';
      setIsFinalizingOutput(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setAiExplanation(text);
    } catch (err) {
      setError('Failed to generate explanation. Please try again.');
    } finally {
      setIsGeneratingExplanation(false);
      setIsFinalizingOutput(false);
    }
  };

  const generateGuidedQuestions = async () => {
    setIsLoading(true);
    setIsPreparingQuestions(true);
    setError('');
    try {
      const response = await feynmanAPI.generateGuidedQuestions(topic, level, characterContext);
      setGuidedQuestions(response.questions);
      setCurrentStep(2);
    } catch (err) {
      setError('Failed to generate guided questions. Please try again.');
    } finally {
      setIsLoading(false);
      setIsPreparingQuestions(false);
    }
  };

  const handleGuidedQuestionsComplete = async (explanation) => {
    setUserExplanation(explanation);
    setIsLoading(true);
    setIsAnalyzingGaps(true);
    setIsFinalizingOutput(false);
    setError('');
    
    try {
      // Automatically generate knowledge gaps after completing guided questions
      const response = await feynmanAPI.identifyGaps(topic, explanation, characterContext);
      const text = response.gaps || '';
      setIsFinalizingOutput(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setKnowledgeGaps(text);
      saveGapsReview(topic, text);
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to identify knowledge gaps. Please try again.');
    } finally {
      setIsLoading(false);
      setIsAnalyzingGaps(false);
      setIsFinalizingOutput(false);
    }
  };

  const identifyGaps = async () => {
    if (!userExplanation.trim()) {
      setError('Please provide your explanation first.');
      return;
    }

    setIsLoading(true);
    setIsAnalyzingGaps(true);
    setIsFinalizingOutput(false);
    setError('');
    try {
      const response = await feynmanAPI.identifyGaps(topic, userExplanation, characterContext);
      const text = response.gaps || '';
      setIsFinalizingOutput(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setKnowledgeGaps(text);
      saveGapsReview(topic, text);
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to identify knowledge gaps. Please try again.');
    } finally {
      setIsLoading(false);
      setIsAnalyzingGaps(false);
      setIsFinalizingOutput(false);
    }
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await feynmanAPI.generateQuestions(topic, level, 5);
      setQuestions(response.questions);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refineExplanation = async () => {
    if (!userExplanation.trim()) {
      setError('Please provide your explanation first.');
      return;
    }

    setIsLoading(true);
    setIsFinalizingOutput(false);
    setError('');
    try {
      const response = await feynmanAPI.refineExplanation(topic, userExplanation, 'general', characterContext);
      const text = response.refined || '';
      setIsFinalizingOutput(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setRefinedExplanation(text);
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to refine explanation. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFinalizingOutput(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const showExplanationLoader =
      isGeneratingExplanation || (isFinalizingOutput && !aiExplanation);
    const showGapsLoader =
      isAnalyzingGaps || (isFinalizingOutput && !knowledgeGaps);
    const showRefineLoader =
      isLoading || (isFinalizingOutput && !refinedExplanation);

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Simple Explanation of "{topic}"
              </h2>
              <p className="text-gray-600 mb-6">
                Let me explain this topic in simple terms:
              </p>
            </div>
            
            {showExplanationLoader ? (
              <div className="card text-center py-12">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <LearningCharacter step={1} size="medium" />
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p className="text-gray-600">Preparing explanation...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <SpeakingCharacter
                  text={`Let me explain "${topic}" in simple terms:`}
                  expression="friendly"
                  size="medium"
                  showVoiceControls={true}
                />
                <StructuredContent content={aiExplanation} />
              </div>
            )}
            
            {!!aiExplanation && !isGeneratingExplanation && !isFinalizingOutput && (
              <div className="flex justify-center">
                <button
                  onClick={generateGuidedQuestions}
                  disabled={isPreparingQuestions}
                  className="gradient-button text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
                >
                  {isPreparingQuestions ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Preparing Questions...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Guided Explanation</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Mode Toggle */}
            {guidedQuestions.length > 0 && (
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className={`text-sm ${!useConversationalMode ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                  Traditional
                </span>
                <button
                  onClick={() => setUseConversationalMode(!useConversationalMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useConversationalMode ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useConversationalMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${useConversationalMode ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                  Conversational
                </span>
              </div>
            )}

            {guidedQuestions.length > 0 ? (
              useConversationalMode ? (
                <ConversationalQuestions
                  initialQuestions={guidedQuestions}
                  onComplete={handleGuidedQuestionsComplete}
                  onBack={prevStep}
                  topic={topic}
                  level={level}
                />
              ) : (
                <GuidedQuestions
                  questions={guidedQuestions}
                  onComplete={handleGuidedQuestionsComplete}
                  onBack={prevStep}
                  topic={topic}
                />
              )
            ) : (
              <div className="text-center py-12">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <LearningCharacter step={2} size="medium" />
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p className="text-gray-600">Loading guided questions...</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Knowledge Gaps Identified
              </h2>
              <p className="text-gray-600 mb-6">
                I've analyzed your explanation and found some areas to improve:
              </p>
            </div>
            
            {showGapsLoader ? (
              <div className="card text-center py-12">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <LearningCharacter step={3} size="medium" />
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p className="text-gray-600">Finalizing insights...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <SpeakingCharacter
                  text="I've analyzed your explanation and found some areas to improve:"
                  expression="focused"
                  size="medium"
                  showVoiceControls={true}
                />
                <StructuredContent content={knowledgeGaps} />
              </div>
            )}
            
            {knowledgeGaps && (
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={generateQuestions}
                  disabled={isLoading}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      <span>Generate Practice Questions</span>
                    </>
                  )}
                </button>
                <button
                  onClick={refineExplanation}
                  disabled={isLoading}
                  className="gradient-button text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Refining...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Refine My Explanation</span>
                    </>
                  )}
                </button>
              </div>
            )}
            
            {questions.length > 0 && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <LearningCharacter step={3} size="small" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Practice Questions
                  </h3>
                </div>
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900 flex-1">
                          {index + 1}. {q.question}
                        </p>
                        <VoiceControls 
                          text={q.question}
                          showTTS={true}
                          showRecognition={false}
                          className="ml-2"
                        />
                      </div>
                      <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                        {q.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {knowledgeGaps && !refinedExplanation && (
              <div className="flex justify-center">
                <button
                  onClick={nextStep}
                  className="gradient-button text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Continue to Final Step</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {showRefineLoader ? (
              <div className="card text-center py-12">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <LearningCharacter step={4} size="medium" />
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p className="text-gray-600">Refining your explanation...</p>
              </div>
            ) : refinedExplanation ? (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Refined Explanation
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Here's your improved explanation with my suggestions:
                  </p>
                </div>
                
                <div className="space-y-6">
                  <SpeakingCharacter
                    text="Here's your improved explanation with my suggestions:"
                    expression="excited"
                    size="medium"
                    showVoiceControls={true}
                  />
                  <StructuredContent content={refinedExplanation} />
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Learning Session Complete
                </h2>
                <p className="text-gray-600 mb-6">
                  You've completed the Feynman Technique for "{topic}". Review your explanation and the knowledge gaps identified above.
                </p>
              </div>
            )}
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <LearningCharacter step={4} size="small" />
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Congratulations!
                  </h3>
                </div>
              </div>
              <p className="text-green-700">
                You've completed the Feynman Technique for "{topic}". You now have a deeper 
                understanding of the topic and can explain it clearly to others. 
                {questions.length > 0 && " Consider practicing with the questions above to further solidify your knowledge."}
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.href = '/learn'}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>Learn Another Topic</span>
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="gradient-button text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/learn'}
                className="gradient-button text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Learning: {topic}
          </h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {level} level
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  isActive ? 'text-primary-600' : 
                  isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-primary-600 bg-primary-50' :
                    isCompleted ? 'border-green-600 bg-green-50' :
                    'border-gray-300 bg-white'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="hidden sm:block font-medium">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div key={currentStep} className="animate-slide-up">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Session;
