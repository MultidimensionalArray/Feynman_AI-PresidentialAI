import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Brain, Lightbulb, Target, RefreshCw, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { feynmanAPI } from '../services/api';
import GuidedQuestions from '../components/GuidedQuestions';
import VoiceControls from '../components/VoiceControls';
import { SpeakingCharacter, LearningCharacter } from '../components/Character';
import { useCharacter } from '../context/CharacterContext';

const Session = () => {
  const { topic } = useParams();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'beginner';
  const { character } = useCharacter();
  const personaId = character.personaId;
  const companionName =
    character.persona?.shortName || character.persona?.name?.split(' ')[0] || 'Alex';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userExplanation, setUserExplanation] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [knowledgeGaps, setKnowledgeGaps] = useState('');
  const [questions, setQuestions] = useState([]);
  const [guidedQuestions, setGuidedQuestions] = useState([]);
  const [refinedExplanation, setRefinedExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { number: 1, title: "Simple Explanation", icon: Lightbulb, color: "text-green-600" },
    { number: 2, title: "Your Explanation", icon: Brain, color: "text-blue-600" },
    { number: 3, title: "Identify Gaps", icon: Target, color: "text-purple-600" },
    { number: 4, title: "Review & Simplify", icon: RefreshCw, color: "text-orange-600" }
  ];

  useEffect(() => {
    if (currentStep === 1) {
      generateSimpleExplanation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, level, personaId]);

  const generateSimpleExplanation = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await feynmanAPI.generateExplanation(topic, level, personaId);
      setAiExplanation(response.explanation);
    } catch (err) {
      setError('Failed to generate explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateGuidedQuestions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await feynmanAPI.generateGuidedQuestions(topic, level, personaId);
      setGuidedQuestions(response.questions);
      setCurrentStep(2);
    } catch (err) {
      setError('Failed to generate guided questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuidedQuestionsComplete = async (explanation) => {
    setUserExplanation(explanation);
    setIsLoading(true);
    setError('');
    
    try {
      // Automatically generate knowledge gaps after completing guided questions
      const response = await feynmanAPI.identifyGaps(topic, explanation, personaId);
      setKnowledgeGaps(response.gaps);
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to identify knowledge gaps. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const identifyGaps = async () => {
    if (!userExplanation.trim()) {
      setError('Please provide your explanation first.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await feynmanAPI.identifyGaps(topic, userExplanation, personaId);
      setKnowledgeGaps(response.gaps);
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to identify knowledge gaps. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await feynmanAPI.generateQuestions(topic, level, 5, personaId);
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
    setError('');
    try {
      const response = await feynmanAPI.refineExplanation(topic, userExplanation, 'general', personaId);
      setRefinedExplanation(response.refined);
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to refine explanation. Please try again.');
    } finally {
      setIsLoading(false);
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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Simple Explanation of "{topic}"
              </h2>
              <p className="text-gray-600 mb-6">
                {companionName} breaks this topic into simple, learner-friendly steps:
              </p>
            </div>
            
            {isLoading ? (
              <div className="card text-center py-12">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <LearningCharacter step={1} size="medium" />
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p className="text-gray-600">Generating explanation...</p>
              </div>
            ) : (
              <SpeakingCharacter
                text={aiExplanation}
                expression="friendly"
                size="medium"
                showVoiceControls={true}
                className="mb-6"
              />
            )}
            
            <div className="flex justify-center">
              <button
                onClick={generateGuidedQuestions}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Preparing Questions...</span>
                  </>
                ) : (
                  <>
                    <span>Start Guided Explanation</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {guidedQuestions.length > 0 ? (
              <GuidedQuestions
                questions={guidedQuestions}
                onComplete={handleGuidedQuestionsComplete}
                onBack={prevStep}
                topic={topic}
              />
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
            
            {isLoading ? (
              <div className="card text-center py-12">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <LearningCharacter step={3} size="medium" />
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p className="text-gray-600">Analyzing your explanation...</p>
              </div>
            ) : (
              <SpeakingCharacter
                text={knowledgeGaps}
                expression="focused"
                size="medium"
                showVoiceControls={true}
                className="mb-6"
              />
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
                  className="btn-primary flex items-center justify-center space-x-2"
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
                  className="btn-primary flex items-center space-x-2"
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
            {refinedExplanation ? (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Refined Explanation
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Here's your improved explanation with my suggestions:
                  </p>
                </div>
                
                <SpeakingCharacter
                  text={refinedExplanation}
                  expression="excited"
                  size="medium"
                  showVoiceControls={true}
                  className="mb-6"
                />
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
                className="btn-primary flex items-center space-x-2"
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
            className="btn-primary"
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
      {renderStepContent()}
    </div>
  );
};

export default Session;
