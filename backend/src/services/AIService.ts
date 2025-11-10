import OpenAIService from './OpenAIService';
import ClaudeService from './ClaudeService';
import GeminiService from './GeminiService';

export default class AIService {
  static async getResponse(provider: string, prompt: string, opts: any = {}) {
    switch (provider) {
      case 'openai':
        return await OpenAIService.call(prompt, opts);
      case 'claude':
        return await ClaudeService.call(prompt, opts);
      case 'gemini':
        return await GeminiService.call(prompt, opts);
      default:
        // fallback to OpenAI
        return await OpenAIService.call(prompt, opts);
    }
  }
}
