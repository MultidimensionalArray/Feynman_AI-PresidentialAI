import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle, X } from 'lucide-react';
import VoiceTextarea from './VoiceTextarea';
import VoiceControls from './VoiceControls';
import { feynmanAPI } from '../services/api';
import voiceService from '../services/voiceService';

const ConversationalQuestions = ({ initialQuestions, onComplete, onBack, topic, level }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEndSession, setShowEndSession] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [characterContext, setCharacterContext] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [nonAnswerCount, setNonAnswerCount] = useState(0);
  const [vagueCount, setVagueCount] = useState(0);
  const [restartNotice, setRestartNotice] = useState('');
  const questionCountRef = useRef(0);
  const chatEndRef = useRef(null);

  // Load character context
  useEffect(() => {
    const loadCharacterContext = () => {
      const savedCharacter = localStorage.getItem('characterSelection');
      if (savedCharacter) {
        const characterSelection = JSON.parse(savedCharacter);
        const { findPersonaById } = require('../config/characterProfiles');
        const persona = findPersonaById(characterSelection.personaId);
        setCharacterContext(persona);
      }
    };
    
    loadCharacterContext();
    
    window.addEventListener('characterSelectionChanged', loadCharacterContext);
    
    return () => {
      window.removeEventListener('characterSelectionChanged', loadCharacterContext);
    };
  }, []);

  // Initialize with first question
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setCurrentQuestion(initialQuestions[0]);
      questionCountRef.current = 1;
      setShowHint(false); // Reset hint visibility for first question
      setRestartNotice('');
      setNonAnswerCount(0);
      setVagueCount(0);
    }
  }, [initialQuestions]);

  // Auto-speak when new question is set
  useEffect(() => {
    if (currentQuestion && autoSpeak) {
      const speakQuestion = () => {
        // Only speak the question, not the hint (unless hint is shown)
        const questionText = currentQuestion.question;
        voiceService.speak(questionText, {
          rate: 0.9,
          pitch: 1,
          volume: 1
        });
      };
      
      // Small delay to ensure UI is ready
      setTimeout(speakQuestion, 500);
    }
  }, [currentQuestion, autoSpeak]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [questionHistory, currentQuestion, showHint]);

  const generateNextQuestion = async (userAnswer) => {
    setIsLoading(true);
    try {
      // Create context from conversation history
      const conversationContext = questionHistory.map(qa => ({
        question: qa.question,
        answer: qa.answer,
        category: qa.category
      }));

      const response = await feynmanAPI.generateAdaptiveQuestion({
        topic,
        level,
        conversationHistory: conversationContext,
        currentAnswer: userAnswer,
        questionCount: questionCountRef.current,
        characterContext
      });

      return response.nextQuestion;
    } catch (error) {
      console.error('Error generating next question:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeAnswer = (answer) => answer.toLowerCase().replace(/\s+/g, ' ').trim();

  const isNonAnswer = (answer) => {
    const normalized = normalizeAnswer(answer);
    if (!normalized) return true;
    const stripped = normalized.replace(/[^a-z0-9]/g, '');
    if (!stripped) return true;
    const nonAnswers = [
      "i don't know",
      "i dont know",
      "idk",
      "no idea",
      "not sure",
      "unsure",
      "i have no idea",
      "dont know",
      "cannot remember",
      "can't remember",
      "can't recall",
      "dont recall",
      "no clue",
      "n/a"
    ];
    return nonAnswers.some((phrase) => normalized === phrase || normalized.includes(phrase));
  };

  const isVagueAnswer = (answer) => {
    const normalized = normalizeAnswer(answer);
    if (!normalized) return true;
    if (normalized.length < 8) return true;
    const wordCount = normalized.split(' ').filter(Boolean).length;
    if (wordCount < 4) return true;
    const vagueMarkers = [
      'maybe',
      'kind of',
      'kinda',
      'sort of',
      'stuff',
      'things',
      'something',
      'somehow',
      'whatever',
      'not really',
      'i guess',
      'probably'
    ];
    return vagueMarkers.some((marker) => normalized.includes(marker));
  };

  const restartConversation = (reason) => {
    setRestartNotice(reason);
    setQuestionHistory([]);
    setCurrentAnswer('');
    setShowHint(false);
    setShowEndSession(false);
    questionCountRef.current = 1;
    setCurrentQuestion(initialQuestions && initialQuestions.length > 0 ? initialQuestions[0] : currentQuestion);
    setNonAnswerCount(0);
    setVagueCount(0);
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;

    const nonAnswer = isNonAnswer(currentAnswer);
    const vague = nonAnswer || isVagueAnswer(currentAnswer);
    const nextNonAnswerCount = nonAnswerCount + (nonAnswer ? 1 : 0);
    const nextVagueCount = vagueCount + (vague ? 1 : 0);
    const totalAnswered = questionHistory.length + 1;

    if (nextNonAnswerCount >= 3) {
      restartConversation("Let's reset this part and try again with more complete answers.");
      return;
    }

    if (totalAnswered >= 3 && nextVagueCount / totalAnswered > 0.5) {
      restartConversation("Let's restart this section and aim for clearer, more specific answers.");
      return;
    }

    // Add current Q&A to history
    const newHistoryEntry = {
      question: currentQuestion.question,
      answer: currentAnswer,
      category: currentQuestion.category,
      timestamp: Date.now()
    };

    setQuestionHistory(prev => [...prev, newHistoryEntry]);
    setCurrentAnswer('');
    setNonAnswerCount(nextNonAnswerCount);
    setVagueCount(nextVagueCount);

    // Generate next question
    const nextQuestion = await generateNextQuestion(currentAnswer);
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      questionCountRef.current += 1;
      setShowHint(false); // Reset hint visibility for new question
      
      // Show end session option after 3+ questions
      if (questionCountRef.current >= 3) {
        setShowEndSession(true);
      }
    } else {
      // If no next question, complete the session
      handleEndSession();
    }
  };

  const buildFullExplanation = (history, pendingAnswer) => {
    const entries = [...history];
    if (pendingAnswer && currentQuestion) {
      const lastQuestion = entries.length ? entries[entries.length - 1].question : null;
      if (lastQuestion !== currentQuestion.question) {
        entries.push({
          question: currentQuestion.question,
          answer: pendingAnswer,
          category: currentQuestion.category,
          timestamp: Date.now(),
        });
      }
    }

    return entries
      .map((qa) => `**${qa.question}**\n${qa.answer}`)
      .join('\n\n');
  };

  const handleEndSession = () => {
    const pendingAnswer = currentAnswer.trim();
    const fullExplanation = buildFullExplanation(questionHistory, pendingAnswer);
    setCurrentAnswer('');
    onComplete(fullExplanation);
  };

  const handleSkipQuestion = () => {
    if (currentQuestion) {
      const nextNonAnswerCount = nonAnswerCount + 1;
      const nextVagueCount = vagueCount + 1;
      const totalAnswered = questionHistory.length + 1;

      if (nextNonAnswerCount >= 3) {
        restartConversation("Let's reset this part and try again with more complete answers.");
        return;
      }

      if (totalAnswered >= 3 && nextVagueCount / totalAnswered > 0.5) {
        restartConversation("Let's restart this section and aim for clearer, more specific answers.");
        return;
      }

      const newHistoryEntry = {
        question: currentQuestion.question,
        answer: '[Skipped]',
        category: currentQuestion.category,
        timestamp: Date.now()
      };

      setQuestionHistory(prev => [...prev, newHistoryEntry]);
      setNonAnswerCount(nextNonAnswerCount);
      setVagueCount(nextVagueCount);
      
      // Generate next question
      generateNextQuestion('[Skipped]').then(nextQuestion => {
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
          questionCountRef.current += 1;
          setCurrentAnswer('');
          setShowHint(false); // Reset hint visibility for new question
        } else {
          handleEndSession();
        }
      });
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
      case 'follow-up':
        return '🔄';
      case 'clarification':
        return '❓';
      default:
        return '❓';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'basic':
        return 'bg-blue-100 text-blue-800 dark:bg-sky-900 dark:text-sky-200';
      case 'process':
        return 'bg-green-100 text-green-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'example':
        return 'bg-yellow-100 text-yellow-800 dark:bg-amber-900 dark:text-amber-200';
      case 'analogy':
        return 'bg-purple-100 text-purple-800 dark:bg-violet-900 dark:text-violet-200';
      case 'application':
        return 'bg-red-100 text-red-800 dark:bg-rose-900 dark:text-rose-200';
      case 'follow-up':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'clarification':
        return 'bg-orange-100 text-orange-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const messageHistory = questionHistory.flatMap((qa) => ([
    {
      id: `q-${qa.timestamp}`,
      role: 'assistant',
      text: qa.question,
      category: qa.category,
    },
    {
      id: `a-${qa.timestamp}`,
      role: 'user',
      text: qa.answer,
    }
  ]));

  const lastHistoryQuestion = questionHistory.length
    ? questionHistory[questionHistory.length - 1].question
    : null;
  const shouldShowCurrentQuestion =
    !isLoading || currentQuestion.question !== lastHistoryQuestion;
  const messages = [...messageHistory];

  if (shouldShowCurrentQuestion) {
    messages.push({
      id: `current-${questionCountRef.current}`,
      role: 'assistant',
      text: currentQuestion.question,
      category: currentQuestion.category,
      hint: currentQuestion.hint,
      isCurrent: true,
    });
  }

  if (isLoading) {
    messages.push({
      id: 'typing-indicator',
      role: 'assistant',
      text: 'Thinking...',
      isTyping: true,
    });
  }

  const chatHeight = Math.min(900, 320 + messages.length * 90);

  return (
    <div className="space-y-6">
      {restartNotice && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
          {restartNotice}
        </div>
      )}
      {/* Progress Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm text-gray-500">Question {questionCountRef.current}</span>
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${Math.min((questionCountRef.current / 8) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chat Thread */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 transition-all duration-300">
        <div
          className="space-y-4 overflow-y-auto pr-1 transition-all duration-300"
          style={{ maxHeight: `${chatHeight}px` }}
        >
          {messages.map((message) => {
            const isAssistant = message.role === 'assistant';
            const isSkipped = message.text === '[Skipped]';

            return (
              <div
                key={message.id}
                className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-slide-up`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md border ${
                    isAssistant
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 rounded-tl-sm'
                      : 'bg-blue-600 text-white border-blue-500/60 rounded-tr-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-sm leading-relaxed ${isSkipped ? 'italic opacity-80' : ''}`}>
                      {message.text}
                    </p>
                    {isAssistant && !message.isTyping && (
                      <VoiceControls
                        text={message.text}
                        showTTS={true}
                        showRecognition={false}
                        className="shrink-0"
                      />
                    )}
                  </div>

                  {isAssistant && message.category && (
                    <div className="mt-2 flex items-center space-x-2 text-xs">
                      <span className="text-base">{getCategoryIcon(message.category)}</span>
                      <span className={`px-2 py-0.5 rounded-full font-medium ${getCategoryColor(message.category)}`}>
                        {message.category}
                      </span>
                    </div>
                  )}

                  {message.isCurrent && message.hint && (
                    <button
                      onClick={() => {
                        const newShowHint = !showHint;
                        setShowHint(newShowHint);

                        if (newShowHint && autoSpeak) {
                          setTimeout(() => {
                            voiceService.speak(message.hint, {
                              rate: 0.9,
                              pitch: 1,
                              volume: 1,
                            });
                          }, 100);
                        }
                      }}
                      className="mt-3 inline-flex items-center space-x-1 text-xs text-blue-600 dark:text-cyan-300 hover:underline"
                    >
                      <Lightbulb className="h-3 w-3" />
                      <span>{showHint ? 'Hide hint' : 'Show hint'}</span>
                    </button>
                  )}

                  {message.isCurrent && showHint && message.hint && (
                    <div className="mt-2 rounded-xl border border-blue-100 dark:border-cyan-800 bg-blue-50 dark:bg-slate-950 p-3 text-xs text-blue-800 dark:text-cyan-200">
                      {message.hint}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Answer Input */}
        <div className="mt-4 border-t border-gray-200 dark:border-slate-800 pt-4">
          <VoiceTextarea
            value={currentAnswer}
            onChange={setCurrentAnswer}
            placeholder="Message your guide..."
            className="min-h-[110px]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={handleSkipQuestion}
            className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Skip</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {showEndSession && (
            <button
              onClick={handleEndSession}
              className="flex items-center space-x-2 px-4 py-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              <span>I'm ready to move on</span>
            </button>
          )}
          
          <button
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer.trim() || isLoading}
            className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Thinking...' : 'Continue'}</span>
          </button>
        </div>
      </div>

      {/* Auto-speak Toggle */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span>Auto-speak questions</span>
        </label>
      </div>

      {/* Conversation History (Collapsed) */}
      {questionHistory.length > 0 && (
        <details className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
            Conversation History ({questionHistory.length} questions)
          </summary>
          <div className="space-y-3 mt-3 text-sm text-gray-600 dark:text-slate-300">
            {questionHistory.map((qa, index) => (
              <div key={index} className="rounded-lg p-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getCategoryIcon(qa.category)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(qa.category)}`}>
                    {qa.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-1">{qa.question}</p>
                <p className="text-sm text-gray-600 dark:text-slate-300">{qa.answer}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default ConversationalQuestions;
