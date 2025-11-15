import OpenAIService from './OpenAIService';
import ClaudeService from './ClaudeService';
import GeminiService from './GeminiService';
import { IClient } from '../models/Client';

type AIProvider = 'openai' | 'claude' | 'gemini';

const ProvidersMap: Record<AIProvider, any> = {
  openai: OpenAIService,
  claude: ClaudeService,
  gemini: GeminiService,
};

export default class AIService {
  static async getResponse(client: IClient, prompt: string, opts: any = {}) {
    const provider = client.ai_provider || 'openai';
    const aiKeys = client.api_keys || {};

    const ProvidersMap: Record<string, any> = {
      openai: class {
        static async call(prompt: string, opts: any = {}) {
          const key = aiKeys.openai;
          if (!key) throw new Error('OpenAI API key not set for this client');
          const url = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
          const body = { model: opts.model || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], ...opts };
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return data.choices?.[0]?.message?.content ?? JSON.stringify(data);
        }
      },
      claude: class {
        static async call(prompt: string, opts: any = {}) {
          const key = aiKeys.claude;
          if (!key) throw new Error('Claude API key not set for this client');
          const url = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1/complete';
          const body = { model: opts.model || 'claude-3', prompt, max_tokens_to_sample: opts.max_tokens || 800, ...opts };
          const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': key }, body: JSON.stringify(body) });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return data.completion ?? data.text ?? JSON.stringify(data);
        }
      },
      gemini: class {
        static async call(prompt: string, opts: any = {}) {
          const key = aiKeys.gemini;
          if (!key) throw new Error('Gemini API key not set for this client');
          const url = (process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate') + `?key=${encodeURIComponent(key)}`;
          const body = { prompt: { text: prompt }, ...opts };
          const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return data?.candidates?.[0]?.output ?? data?.candidates?.[0]?.content ?? JSON.stringify(data);
        }
      },
    };

    const Service = ProvidersMap[provider] || ProvidersMap['openai'];
    return Service.call(prompt, opts);
  }
}
