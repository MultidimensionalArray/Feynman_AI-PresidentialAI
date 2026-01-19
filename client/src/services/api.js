import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw new Error(error.response?.data?.error || 'An unexpected error occurred');
  }
);

export const feynmanAPI = {
  // Generate a simple explanation of a topic
  generateExplanation: async (topic, level = 'beginner', characterContext = null) => {
    const response = await api.post('/feynman/explain', {
      topic,
      level,
      characterContext
    });
    return response.data;
  },

  // Generate guided questions for step-by-step explanation
  generateGuidedQuestions: async (topic, level = 'beginner', characterContext = null) => {
    const response = await api.post('/feynman/guided-questions', {
      topic,
      level,
      characterContext
    });
    return response.data;
  },

  // Identify knowledge gaps in user's explanation
  identifyGaps: async (topic, userExplanation, characterContext = null) => {
    const response = await api.post('/feynman/identify-gaps', {
      topic,
      userExplanation,
      characterContext
    });
    return response.data;
  },

  // Generate questions to test understanding
  generateQuestions: async (topic, level = 'beginner', count = 5) => {
    const response = await api.post('/feynman/generate-questions', {
      topic,
      level,
      count
    });
    return response.data;
  },

  // Refine and improve user's explanation
  refineExplanation: async (topic, userExplanation, targetAudience = 'general', characterContext = null) => {
    const response = await api.post('/feynman/refine-explanation', {
      topic,
      userExplanation,
      targetAudience,
      characterContext
    });
    return response.data;
  },

  // Generate adaptive follow-up question based on conversation history
  generateAdaptiveQuestion: async (data) => {
    const response = await api.post('/feynman/adaptive-question', data);
    return response.data;
  },

  // Complete a full Feynman learning session
  completeSession: async (topic, level = 'beginner') => {
    const response = await api.post('/feynman/complete-session', {
      topic,
      level
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;