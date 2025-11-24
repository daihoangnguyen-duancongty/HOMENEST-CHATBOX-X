import fetch from "node-fetch";

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL =
  process.env.CLAUDE_API_URL ?? "https://api.anthropic.com/v1/complete";

interface ClaudeResponse {
  completion?: string;
  text?: string;
  [key: string]: any;
}

export default class ClaudeService {
  static async call(prompt: string, opts: any = {}) {
    if (!CLAUDE_API_KEY) {
      throw new Error("❌ Missing environment variable: CLAUDE_API_KEY");
    }

    const body = {
      model: opts.model ?? "claude-3-sonnet-20240229",
      prompt,
      max_tokens_to_sample: opts.max_tokens ?? 800,
      ...opts,
    };

    const res = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Claude API error (${res.status}): ${txt}`);
    }

    const data: ClaudeResponse = (await res.json()) as ClaudeResponse;
    return data.completion ?? data.text ?? JSON.stringify(data);
  }
}
