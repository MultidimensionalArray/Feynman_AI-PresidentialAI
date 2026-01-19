const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class FeynmanService {
  async generateSimpleExplanation(topic, level = 'beginner', characterContext = null) {
    let systemPrompt = `You are an expert educator using the Feynman Technique. Your goal is to explain complex topics in the simplest possible way, as if teaching a child.

The Feynman Technique has 4 steps:
1. Choose a concept to learn
2. Teach it to a child (simple explanation)
3. Identify gaps in your knowledge
4. Review and simplify

For this request, focus on step 2: Create a simple, clear explanation that a ${level} learner can understand. Use analogies, simple language, and avoid jargon.
Be confident and decisive. Avoid hedging phrases like "maybe," "might," or "could."`;

    // Add character personality if provided
    if (characterContext) {
      systemPrompt += `\n\nYou are embodying the personality of ${characterContext.name}: ${characterContext.tagline}
Your tone should be: ${characterContext.tone}
Your encouragement style: ${characterContext.encouragementStyle}
Style guidelines: ${characterContext.styleGuide.join(', ')}
Start your explanation with your intro message: "${characterContext.introMessage}"`;
    }

    const userPrompt = `Explain "${topic}" using the Feynman Technique. Make it simple enough for a ${level} to understand. Use analogies and avoid technical jargon.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate explanation');
    }
  }

  async generateGuidedQuestions(topic, level = 'beginner', characterContext = null) {
    let systemPrompt = `You are an expert educator using the Feynman Technique. Create a series of guided questions that help someone explain a topic step by step, as if teaching it to a child.

The questions should:
- Start with basic concepts and build up
- Help identify what the person knows and doesn't know
- Encourage simple, clear explanations
- Be appropriate for ${level} level
- Guide the person to think through the topic systematically

Return questions as a JSON array of objects with "question", "hint", and "category" fields. Categories can be: "basic", "process", "example", "analogy", "application".`;

    // Add character personality if provided
    if (characterContext) {
      systemPrompt += `\n\nYou are embodying the personality of ${characterContext.name}: ${characterContext.tagline}
Your tone should be: ${characterContext.tone}
Your encouragement style: ${characterContext.encouragementStyle}
Style guidelines: ${characterContext.styleGuide.join(', ')}
Frame your questions in your unique style and personality.`;
    }

    const userPrompt = `Create 5-7 guided questions for someone learning about "${topic}" at ${level} level. These questions should help them explain the topic step by step using the Feynman Technique.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1200,
        temperature: 0.7,
      });

      // Try to parse as JSON, fallback to text if not valid JSON
      try {
        return JSON.parse(response.choices[0].message.content);
      } catch (parseError) {
        // If not valid JSON, create a fallback structure
        return [
          {
            question: "What is " + topic + " in the simplest terms possible?",
            hint: "Think about how you would explain this to a 10-year-old.",
            category: "basic"
          },
          {
            question: "Can you give me a real-world example of " + topic + "?",
            hint: "Think of something you see or use in everyday life.",
            category: "example"
          },
          {
            question: "What would happen if " + topic + " didn't exist?",
            hint: "Consider the consequences or importance.",
            category: "application"
          }
        ];
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate guided questions');
    }
  }

  async identifyKnowledgeGaps(topic, userExplanation, characterContext = null) {
    let systemPrompt = `You are an expert educator using the Feynman Technique. Your job is to identify knowledge gaps in a user's explanation of a topic.

Look for:
- Missing key concepts
- Incorrect information
- Unclear explanations
- Areas that need more detail
- Confusing language or jargon

Provide constructive feedback that helps the user improve their understanding.
Be direct and confident. Avoid hedging and uncertainty in your assessments.`;

    // Add character personality if provided
    if (characterContext) {
      systemPrompt += `\n\nYou are embodying the personality of ${characterContext.name}: ${characterContext.tagline}
Your tone should be: ${characterContext.tone}
Your encouragement style: ${characterContext.encouragementStyle}
Style guidelines: ${characterContext.styleGuide.join(', ')}
Provide feedback in your unique supportive style.`;
    }

    const userPrompt = `Topic: "${topic}"
User's explanation: "${userExplanation}"

Identify the knowledge gaps and areas for improvement in this explanation. Be specific and constructive.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.5,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to identify knowledge gaps');
    }
  }

  async generateQuestions(topic, level = 'beginner', count = 5) {
    const systemPrompt = `You are an expert educator creating questions to test understanding using the Feynman Technique.

Create questions that:
- Test deep understanding, not just memorization
- Help identify knowledge gaps
- Encourage explanation in simple terms
- Build from basic to more complex concepts
- Are appropriate for ${level} level

Return questions as a JSON array of objects with "question" and "type" fields. Types can be: "conceptual", "application", "analogy", "explanation".`;

    const userPrompt = `Generate ${count} questions about "${topic}" for a ${level} learner. Focus on questions that test true understanding using the Feynman Technique principles.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      // Try to parse as JSON, fallback to text if not valid JSON
      try {
        return JSON.parse(response.choices[0].message.content);
      } catch (parseError) {
        // If not valid JSON, return as text
        return [{ 
          question: response.choices[0].message.content, 
          type: "explanation" 
        }];
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate questions');
    }
  }

  async refineExplanation(topic, userExplanation, targetAudience = 'general', characterContext = null) {
    let systemPrompt = `You are an expert educator using the Feynman Technique. Help refine a user's explanation to make it clearer and more accessible.

Focus on:
- Simplifying complex language
- Adding helpful analogies
- Improving clarity and flow
- Making it appropriate for ${targetAudience}
- Maintaining accuracy while improving accessibility

Provide the refined explanation and explain what changes you made and why.`;

    // Add character personality if provided
    if (characterContext) {
      systemPrompt += `\n\nYou are embodying the personality of ${characterContext.name}: ${characterContext.tagline}
Your tone should be: ${characterContext.tone}
Your encouragement style: ${characterContext.encouragementStyle}
Style guidelines: ${characterContext.styleGuide.join(', ')}
Refine the explanation in your unique style and voice.`;
    }

    const userPrompt = `Topic: "${topic}"
User's explanation: "${userExplanation}"
Target audience: ${targetAudience}

Refine this explanation to make it clearer and more accessible. Explain what changes you made and why.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1200,
        temperature: 0.6,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to refine explanation');
    }
  }

  async generateAdaptiveQuestion(data) {
    const { topic, level, conversationHistory, currentAnswer, questionCount, characterContext } = data;
    
    let systemPrompt = `You are an expert educator using the Feynman Technique. Your role is to generate adaptive follow-up questions that create a personalized learning path.

Based on the conversation history and the user's current answer, generate the next most appropriate question that will:
- Build on what they've already shared
- Address any knowledge gaps you've identified
- Guide them deeper into understanding the topic
- Adapt to their learning level and style

The question should feel natural and conversational, like a real teacher would ask.`;

    // Add character personality if provided
    if (characterContext) {
      systemPrompt += `\n\nYou are embodying the personality of ${characterContext.name}: ${characterContext.tagline}
Your tone should be: ${characterContext.tone}
Your encouragement style: ${characterContext.encouragementStyle}
Style guidelines: ${characterContext.styleGuide.join(', ')}
Frame your question in your unique style and personality.`;
    }

    // Build conversation context
    let conversationContext = `Topic: "${topic}" (${level} level)
Current question number: ${questionCount}

Conversation History:
`;
    
    conversationHistory.forEach((qa, index) => {
      conversationContext += `${index + 1}. Q: ${qa.question}\n   A: ${qa.answer}\n\n`;
    });

    conversationContext += `Current Answer: ${currentAnswer}`;

    const userPrompt = `${conversationContext}

Generate the next question that will help the user understand "${topic}" better. Consider:
- What they've already explained well
- What gaps or unclear areas you've noticed
- How to build on their current understanding
- What would be most helpful to explore next

Return a JSON object with:
- question: The next question to ask
- hint: A helpful hint or clarification
- category: One of: basic, process, example, analogy, application, follow-up, clarification
- reasoning: Brief explanation of why this question is important

If the user seems to have a good understanding and you've covered the main concepts, you can return null for the question to indicate the session should end.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      
      try {
        const result = JSON.parse(content);
        return { nextQuestion: result };
      } catch (parseError) {
        // If JSON parsing fails, create a default follow-up question
        return {
          nextQuestion: {
            question: "Can you tell me more about that?",
            hint: "Think about what you just explained and see if there are any details you'd like to add.",
            category: "follow-up",
            reasoning: "Following up on the previous answer to encourage deeper thinking."
          }
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate adaptive question');
    }
  }

  async completeFeynmanSession(topic, level = 'beginner') {
    const systemPrompt = `You are an expert educator guiding someone through a complete Feynman Technique learning session.

The Feynman Technique has 4 steps:
1. Choose a concept to learn
2. Teach it to a child (simple explanation)
3. Identify gaps in your knowledge
4. Review and simplify

Create a comprehensive learning session that guides the user through all 4 steps for the topic "${topic}" at ${level} level.`;

    const userPrompt = `Create a complete Feynman Technique learning session for "${topic}" at ${level} level. Include:
1. A simple explanation
2. Key questions to test understanding
3. Common knowledge gaps to watch for
4. Steps to review and simplify
5. Analogies and examples to use

Structure this as a guided learning experience.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to complete learning session');
    }
  }
}

module.exports = new FeynmanService();
