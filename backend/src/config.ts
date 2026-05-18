export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
export const OPENAI_API_BASE = process.env.OPENAI_API_BASE ?? process.env.OPENROUTER_BASE_URL;

export function validateEnv(): void {
  // If an OpenRouter key is provided, map it to the expected OpenAI env vars.
  if (!process.env.OPENAI_API_KEY && process.env.OPENROUTER_API_KEY) {
    process.env.OPENAI_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!process.env.OPENAI_API_BASE) {
      process.env.OPENAI_API_BASE = process.env.OPENROUTER_BASE_URL || "https://api.openrouter.ai/v1";
    }
  }

  const required = [
    "OPENAI_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
