import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  process.env.GEMINI_API_URL ??
  'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate';

// định nghĩa interface cho response của Gemini
interface GeminiCandidate {
  output?: string;
  content?: string;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
  [key: string]: any; // nếu có thêm các trường khác
}

export default class GeminiService {
  static async call(prompt: string, opts: any = {}) {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');

    const body = {
      prompt: {
        text: prompt
      },
      // bạn có thể cấu hình temperature, maxOutputTokens, v.v.
      ...opts
    };

    const url = `${GEMINI_API_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${txt}`);
    }

    // ép kiểu dữ liệu JSON về GeminiResponse
    const data: GeminiResponse = (await res.json()) as GeminiResponse;

    // lấy output của candidate đầu tiên
    const output =
      data?.candidates?.[0]?.output ??
      data?.candidates?.[0]?.content ??
      JSON.stringify(data);

    return output;
  }
}
