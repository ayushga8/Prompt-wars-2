/**
 * @module routes/ai
 * @description Express router for AI-powered endpoints using Google Gemini.
 * Provides a contextual chat tutor and quiz explanation generator,
 * both supporting multilingual responses (English, Hindi, Tamil).
 */

const express = require('express');
const { sanitizeChatMessage } = require('../utils/validation');

const router = express.Router();

/**
 * Ordered list of Gemini model names to attempt, in preference order.
 * Falls back to the next model if the current one is unavailable.
 * @constant {string[]}
 */
const GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

/**
 * Maps a language code to a Gemini prompt instruction string.
 *
 * @param {string} lang - Language code ('en', 'hi', or 'ta')
 * @returns {string} Instruction for Gemini specifying the response language
 */
function getLanguageInstruction(lang) {
  switch (lang) {
    case 'hi': return 'Respond in Hindi (हिन्दी). Use Devanagari script.';
    case 'ta': return 'Respond in Tamil (தமிழ்). Use Tamil script.';
    default:   return 'Respond in English.';
  }
}

/**
 * Attempts to generate content using multiple Gemini models in sequence.
 * Returns the first successful response or null if all models fail.
 *
 * @param {import('@google/generative-ai').GoogleGenerativeAI} genAI - Initialized Gemini AI client
 * @param {Array<{text: string}>} contents - Content parts to send to the model
 * @returns {Promise<string|null>} The generated text response, or null if all models fail
 */
async function tryGenerateWithFallback(genAI, contents) {
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(contents);
      return result.response.text();
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      continue;
    }
  }
  return null;
}

/**
 * Creates AI route handlers with the injected Gemini AI client.
 * Uses dependency injection to facilitate testing without live API calls.
 *
 * @param {import('@google/generative-ai').GoogleGenerativeAI|null} genAI - Initialized Gemini client, or null if not configured
 * @returns {import('express').Router} Configured Express router
 */
function createAiRoutes(genAI) {
  /**
   * @route POST /api/chat
   * @description AI-powered election education tutor. Accepts a user message
   * and returns a contextual response about Indian elections.
   * Supports English, Hindi, and Tamil responses.
   *
   * @param {Object} req.body
   * @param {string} req.body.message - User's question (max 2000 chars)
   * @param {string} [req.body.moduleContext] - Current learning module title for context
   * @param {string} [req.body.lang='en'] - Response language code
   * @returns {Object} JSON with 'reply' field containing AI response
   */
  router.post('/api/chat', async (req, res) => {
    const { message, moduleContext, lang } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const sanitizedMessage = sanitizeChatMessage(message);
    const langInstruction = getLanguageInstruction(lang);

    const systemPrompt = `You are an expert Indian Election Process Education tutor. The user is currently learning about "${moduleContext || 'Indian Elections'}". 
    
Your responses should be:
- Clear, concise, and educational
- Focused on Indian elections, the Election Commission of India, Indian Constitution, EVMs, and democratic principles
- Reference Indian laws like Representation of the People Act, Article 324, Model Code of Conduct when relevant
- Friendly and encouraging
- If asked about something unrelated to elections or civics, politely redirect to election topics
- Use simple language suitable for Indian students
- Keep responses under 200 words unless the user asks for detail
- ${langInstruction}`;

    if (!genAI) {
      return res.status(500).json({ 
        error: 'AI is not configured',
        reply: 'AI features are currently unavailable because the API key is not set.' 
      });
    }

    const reply = await tryGenerateWithFallback(genAI, [
      { text: systemPrompt },
      { text: sanitizedMessage }
    ]);

    if (reply) {
      return res.json({ reply });
    }

    res.status(500).json({ 
      error: 'All AI models are currently unavailable',
      reply: 'I\'m currently experiencing high demand. Please try again in a few seconds.' 
    });
  });

  /**
   * @route POST /api/explain
   * @description Generates AI-powered explanations for incorrect quiz answers.
   * Provides educational feedback explaining why the correct answer is right
   * and why the student's answer was wrong.
   *
   * @param {Object} req.body
   * @param {string} req.body.question - The quiz question text
   * @param {string} req.body.userAnswer - The student's selected answer
   * @param {string} req.body.correctAnswer - The correct answer text
   * @param {string} [req.body.lang='en'] - Response language code
   * @returns {Object} JSON with 'explanation' field containing AI explanation
   */
  router.post('/api/explain', async (req, res) => {
    const { question, userAnswer, correctAnswer, lang } = req.body;
    if (!question || !correctAnswer) {
      return res.status(400).json({ error: 'Question and correct answer are required' });
    }

    const langInstruction = getLanguageInstruction(lang);

    const prompt = `You are an Indian election education tutor. A student answered a quiz question incorrectly. Explain why their answer is wrong and why the correct answer is right.

${langInstruction}

Question: ${question}
Student's answer: ${userAnswer}
Correct answer: ${correctAnswer}

Give a brief, encouraging explanation in 2-3 sentences. Start by acknowledging the attempt, then explain the correct answer with a relevant fact about Indian elections. Do NOT use markdown formatting.`;

    if (!genAI) {
      return res.status(500).json({ error: 'AI not configured', explanation: '' });
    }

    const explanation = await tryGenerateWithFallback(genAI, [{ text: prompt }]);
    if (explanation) {
      return res.json({ explanation });
    }

    res.status(500).json({ error: 'AI unavailable', explanation: '' });
  });

  return router;
}

module.exports = createAiRoutes;
