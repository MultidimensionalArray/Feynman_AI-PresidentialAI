const express = require('express');
const router = express.Router();
const feynmanService = require('../services/feynmanService');

// POST /api/feynman/explain
// Generate a simple explanation of a topic
router.post('/explain', async (req, res) => {
  try {
    const { topic, level = 'beginner', characterContext } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const explanation = await feynmanService.generateSimpleExplanation(topic, level, characterContext);
    res.json({ explanation });
  } catch (error) {
    console.error('Error generating explanation:', error);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// POST /api/feynman/guided-questions
// Generate guided questions for step-by-step explanation
router.post('/guided-questions', async (req, res) => {
  try {
    const { topic, level = 'beginner', characterContext } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const questions = await feynmanService.generateGuidedQuestions(topic, level, characterContext);
    res.json({ questions });
  } catch (error) {
    console.error('Error generating guided questions:', error);
    res.status(500).json({ error: 'Failed to generate guided questions' });
  }
});

// POST /api/feynman/identify-gaps
// Identify knowledge gaps in user's understanding
router.post('/identify-gaps', async (req, res) => {
  try {
    const { topic, userExplanation, characterContext } = req.body;
    
    if (!topic || !userExplanation) {
      return res.status(400).json({ error: 'Topic and user explanation are required' });
    }

    const gaps = await feynmanService.identifyKnowledgeGaps(topic, userExplanation, characterContext);
    res.json({ gaps });
  } catch (error) {
    console.error('Error identifying gaps:', error);
    res.status(500).json({ error: 'Failed to identify knowledge gaps' });
  }
});

// POST /api/feynman/generate-questions
// Generate questions to test understanding
router.post('/generate-questions', async (req, res) => {
  try {
    const { topic, level = 'beginner', count = 5 } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const questions = await feynmanService.generateQuestions(topic, level, count);
    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// POST /api/feynman/refine-explanation
// Help refine and improve user's explanation
router.post('/refine-explanation', async (req, res) => {
  try {
    const { topic, userExplanation, targetAudience = 'general', characterContext } = req.body;
    
    if (!topic || !userExplanation) {
      return res.status(400).json({ error: 'Topic and user explanation are required' });
    }

    const refined = await feynmanService.refineExplanation(topic, userExplanation, targetAudience, characterContext);
    res.json({ refined });
  } catch (error) {
    console.error('Error refining explanation:', error);
    res.status(500).json({ error: 'Failed to refine explanation' });
  }
});

// POST /api/feynman/adaptive-question
// Generate adaptive follow-up question based on conversation history
router.post('/adaptive-question', async (req, res) => {
  try {
    const { topic, level, conversationHistory, currentAnswer, questionCount, characterContext } = req.body;
    
    if (!topic || !conversationHistory || currentAnswer === undefined) {
      return res.status(400).json({ error: 'Topic, conversation history, and current answer are required' });
    }

    const result = await feynmanService.generateAdaptiveQuestion({
      topic,
      level,
      conversationHistory,
      currentAnswer,
      questionCount,
      characterContext
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error generating adaptive question:', error);
    res.status(500).json({ error: 'Failed to generate adaptive question' });
  }
});

// POST /api/feynman/complete-session
// Complete a full Feynman learning session
router.post('/complete-session', async (req, res) => {
  try {
    const { topic, level = 'beginner' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const session = await feynmanService.completeFeynmanSession(topic, level);
    res.json({ session });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete learning session' });
  }
});

module.exports = router;