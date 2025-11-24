export default class OpenAIService {
  static async call(prompt: string, opts: any = {}) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error("❌ Missing environment variable: OPENAI_API_KEY");
    }

    const OPENAI_API_URL =
      process.env.OPENAI_API_URL ?? "https://api.openai.com/v1/chat/completions";

    const body = {
      model: opts.model ?? "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.max_tokens ?? 1000,
      ...opts,
    };

    const res = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${txt}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? JSON.stringify(data);
  }
}
