import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI requests
  headers: {
    'Content-Type': 'application/json',
  },
});

const attachPersona = (payload, personaId) =>
  personaId ? { ...payload, personaId } : payload;

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
  generateExplanation: async (topic, level = 'beginner', personaId) => {
    const response = await api.post('/feynman/explain', {
      topic,
      level,
      personaId,
    });
    return response.data;
  },

  // Generate guided questions for step-by-step explanation
  generateGuidedQuestions: async (topic, level = 'beginner', personaId) => {
    const response = await api.post('/feynman/guided-questions', attachPersona({
      topic,
      level,
    }, personaId));
    return response.data;
  },

  // Identify knowledge gaps in user's explanation
  identifyGaps: async (topic, userExplanation, personaId) => {
    const response = await api.post('/feynman/identify-gaps', attachPersona({
      topic,
      userExplanation,
    }, personaId));
    return response.data;
  },

  // Generate questions to test understanding
  generateQuestions: async (topic, level = 'beginner', count = 5, personaId) => {
    const response = await api.post('/feynman/generate-questions', attachPersona({
      topic,
      level,
      count,
    }, personaId));
    return response.data;
  },

  // Refine and improve user's explanation
  refineExplanation: async (topic, userExplanation, targetAudience = 'general', personaId) => {
    const response = await api.post('/feynman/refine-explanation', attachPersona({
      topic,
      userExplanation,
      targetAudience,
    }, personaId));
    return response.data;
  },

  // Complete a full Feynman learning session
  completeSession: async (topic, level = 'beginner', personaId) => {
    const response = await api.post('/feynman/complete-session', attachPersona({
      topic,
      level,
    }, personaId));
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;
