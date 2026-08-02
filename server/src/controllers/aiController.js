import { GoogleGenAI } from '@google/genai';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SYSTEM_PROMPTS } from '../prompts/aiPrompts.js';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

/**
 * @desc Generates a hint stream based on the user's input
 * @route POST /api/ai/hint
 * @access Public
 */
export const generateHintStream = asyncHandler(async (req, res) => {
  const { problemTitle, problemStatement, userCode, language, hintLevel = 1 } = req.body;

  if (!problemStatement) {
    throw new ApiError(400, 'Problem statement is required for hint generation');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const userPrompt = `Problem: ${problemTitle}
  Statement: ${problemStatement}
  User Code (${language}):
  \`\`\`${language}
  ${userCode || '// No code written yet'}
  \`\`\`
  Requested Hint Level: ${hintLevel} (1=Intuition, 2=Approach, 3=Edge cases/Logic)`;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPTS.HINT_COACH}\n\n${userPrompt}` }] }],
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate AI hint' })}\n\n`);
    res.end();
  }
});

/**
 * @desc Generates a debug report based on the user's input
 * @route POST /api/ai/debug
 * @access Public
 */
export const generateDebugReport = asyncHandler(async (req, res) => {
  const { problemTitle, problemStatement, userCode, language, verdict, stderr } = req.body;

  const userPrompt = `Problem: ${problemTitle}
  Verdict: ${verdict}
  Language: ${language}

  User Code:
  \`\`\`${language}
  ${userCode}
  \`\`\`

  Execution Context / Errors:
  - Stderr Output: ${stderr || 'None'}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPTS.DEBUG_ANALYST}\n\n${userPrompt}` }] }],
  });

  return res.status(200).json(new ApiResponse(200, { report: response.text }, 'Debug report generated successfully'));
});
