import React, { useState } from 'react';
import { HelpCircle, Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import VoiceTextarea from './VoiceTextarea';
import VoiceControls from './VoiceControls';
import { SpeakingCharacter, LearningCharacter } from './Character';

const GuidedQuestions = ({ questions, onComplete, onBack, topic }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHints, setShowHints] = useState({});

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const toggleHint = (questionIndex) => {
    setShowHints(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      // Combine all answers into a comprehensive explanation
      const fullExplanation = questions.map((q, index) => {
        const answer = answers[index] || '';
        return `**${q.question}**\n${answer}`;
      }).join('\n\n');
      
      onComplete(fullExplanation);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'basic':
        return '🔍';
      case 'process':
        return '⚙️';
      case 'example':
        return '💡';
      case 'analogy':
        return '🔗';
      case 'application':
        return '🎯';
      default:
        return '❓';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'process':
        return 'bg-green-100 text-green-800';
      case 'example':
        return 'bg-yellow-100 text-yellow-800';
      case 'analogy':
        return 'bg-purple-100 text-purple-800';
      case 'application':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEncouragingMessage = () => {
    const messages = [
      "Great job so far! Let's keep going.",
      "You're doing amazing! This is really helpful.",
      "Excellent thinking! I can see you're understanding this well.",
      "Perfect! Your answers are helping me understand what you know.",
      "Wonderful! You're making great progress."
    ];
    return messages[currentQuestionIndex % messages.length];
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Guided Explanation of "{topic}"
        </h2>
        <p className="text-gray-600">
          Let's build your understanding step by step
        </p>
      </div>

      {/* Encouraging Message */}
      {currentQuestionIndex > 0 && (
        <SpeakingCharacter
          text={getEncouragingMessage()}
          expression="encouraging"
          size="small"
          showVoiceControls={false}
          className="mb-4"
        />
      )}

      {/* Current Question */}
      <div className="card">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 font-bold text-sm">
              {currentQuestionIndex + 1}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(currentQuestion.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentQuestion.category)}`}>
                  {currentQuestion.category}
                </span>
              </div>
              
              {/* Voice Controls for Question */}
              <VoiceControls 
                text={currentQuestion.question}
                showTTS={true}
                showRecognition={false}
                className="ml-2"
              />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {currentQuestion.question}
            </h3>
            
            {currentQuestion.hint && (
              <button
                onClick={() => toggleHint(currentQuestionIndex)}
                className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 mb-3"
              >
                <HelpCircle className="h-4 w-4" />
                <span>{showHints[currentQuestionIndex] ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            )}
            
            {showHints[currentQuestionIndex] && currentQuestion.hint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-800 text-sm">{currentQuestion.hint}</p>
                  </div>
                  
                  {/* Voice Controls for Hint */}
                  <VoiceControls 
                    text={currentQuestion.hint}
                    showTTS={true}
                    showRecognition={false}
                    className="ml-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voice-Enabled Textarea */}
        <VoiceTextarea
          value={answers[currentQuestionIndex] || ''}
          onChange={(answer) => handleAnswerChange(currentQuestionIndex, answer)}
          placeholder="Type or speak your answer here... Don't worry about being perfect. The goal is to think through the concept step by step."
          rows={6}
          showTTS={true}
          showVoiceInput={true}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevQuestion}
          disabled={isFirstQuestion}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={nextQuestion}
          disabled={!answers[currentQuestionIndex]?.trim()}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isLastQuestion ? 'Complete Explanation' : 'Next Question'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <LearningCharacter step={2} size="small" />
          <h4 className="font-medium text-gray-900">Your Progress</h4>
        </div>
        <div className="space-y-1">
          {questions.map((q, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                answers[index]?.trim() ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
              }`}>
                {answers[index]?.trim() ? '✓' : index + 1}
              </span>
              <span className={`${answers[index]?.trim() ? 'text-gray-900' : 'text-gray-500'}`}>
                {q.question.length > 50 ? q.question.substring(0, 50) + '...' : q.question}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidedQuestions;