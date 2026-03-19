import { OpenAI } from "openai";

// Conectando ao Ollama (IA Local) através da compatibilidade com a SDK da OpenAI
const openai = new OpenAI({
  baseURL: process.env.OLLAMA_URL || "http://localhost:11434/v1",
  apiKey: "ollama", // Chave fictícia necessária para a SDK não falhar
});

export async function analyzeResume(content: string, locale: string = "pt"): Promise<string> {
  // Sanitização básica contra Prompt Injection e limite seguro de tamanho
  const sanitizedContent = content.substring(0, 15000).replace(/<\|.*?\|>/g, "");

  const language = locale === "en" ? "English" : "Português";
  const systemPrompt = `You are a Human Resources expert.
Your task is to analyze the provided resume and return EXCLUSIVELY a valid JSON object.
The entire content of the JSON response MUST be written in ${language}.
Do not add ANY explanation before or after the JSON.

EXACT expected format:
{
  "score": <number from 0 to 100>,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OLLAMA_MODEL || "llama3", // Substituído gpt-4 pelo modelo local do Ollama
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analise o seguinte currículo:\n\n"""\n${sanitizedContent}\n"""` },
      ],
      response_format: { type: "json_object" }, // Força o LLM a cuspir um JSON estrito
      temperature: 0.3, // Temperatura baixa para análises mais lógicas e menos criativas/alucinadas
    });
    return completion.choices[0]?.message.content || "";
  } catch (error) {
    console.error("[OLLAMA_ERROR] Falha ao analisar currículo:", error);
    throw new Error("Erro na comunicação com o modelo de IA local.");
  }
}
