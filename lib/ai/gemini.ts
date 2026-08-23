import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

export const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (modelName = 'gemini-1.5-pro') => {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2, // Giữ độ chính xác cao cho phân tích dữ liệu BĐS
      topP: 0.8,
      topK: 40,
    },
  });
};
