import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Zap, ArrowRight } from 'lucide-react';

const Learn = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartLearning = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    // Navigate to session page with topic as parameter
    navigate(`/session/${encodeURIComponent(topic.trim())}?level=${level}`);
  };

  const exampleTopics = [
    "Quantum Physics",
    "Machine Learning",
    "Photosynthesis",
    "Supply and Demand",
    "DNA Replication",
    "Climate Change",
    "Blockchain Technology",
    "Human Evolution"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Start Your Learning Journey
        </h1>
        <p className="text-xl text-gray-600">
          Choose a topic and let the Feynman Technique guide you to deep understanding
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleStartLearning} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to learn about?
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, Machine Learning, Quantum Physics..."
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              What's your current level?
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="input-field"
            >
              <option value="beginner">Beginner - New to the topic</option>
              <option value="intermediate">Intermediate - Some knowledge</option>
              <option value="advanced">Advanced - Looking to deepen understanding</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Starting Session...</span>
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                <span>Start Learning Session</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Example Topics */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Popular Topics to Explore
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exampleTopics.map((exampleTopic) => (
            <button
              key={exampleTopic}
              onClick={() => {
                setTopic(exampleTopic);
                // Auto-submit after setting topic
                setTimeout(() => {
                  navigate(`/session/${encodeURIComponent(exampleTopic)}?level=${level}`);
                }, 100);
              }}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <BookOpen className="h-4 w-4 text-primary-600" />
                </div>
                <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {exampleTopic}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Tips */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 rounded-xl p-8 border border-primary-100 dark:border-slate-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 text-primary-600 dark:text-cyan-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
              Pro Tips for Effective Learning
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-slate-200">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 dark:text-cyan-300 font-bold">•</span>
                <span>Be specific with your topic - "Photosynthesis" is better than "Biology"</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 dark:text-cyan-300 font-bold">•</span>
                <span>Start with beginner level even if you think you know the topic</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 dark:text-cyan-300 font-bold">•</span>
                <span>Take your time with each step - rushing defeats the purpose</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 dark:text-cyan-300 font-bold">•</span>
                <span>Be honest about your understanding - gaps are opportunities to learn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
