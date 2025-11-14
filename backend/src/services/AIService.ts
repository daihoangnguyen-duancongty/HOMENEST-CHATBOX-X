import OpenAIService from './OpenAIService';
import ClaudeService from './ClaudeService';
import GeminiService from './GeminiService';

type AIProvider = 'openai' | 'claude' | 'gemini';

const ProvidersMap: Record<AIProvider, any> = {
  openai: OpenAIService,
  claude: ClaudeService,
  gemini: GeminiService,
};

export default class AIService {
  static async getResponse(provider: string, prompt: string, opts: any = {}) {
    const aiProvider = provider.toLowerCase() as AIProvider;

    // Nếu provider không tồn tại, fallback về OpenAI
    const Service = ProvidersMap[aiProvider] || OpenAIService;

    try {
      const response = await Service.call(prompt, opts);
      return response;
    } catch (err) {
      console.error(`AIService error for provider "${provider}":`, err);
      // fallback hoặc trả lỗi
      return `Error: cannot get response from ${provider}`;
    }
  }
}
