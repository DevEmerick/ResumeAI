export async function analyzeResume(resumeText: string) {
  const prompt = `You are an expert recruiter. Analyze the resume below and return:\n\nResume Score (0-100)\nStrengths\nWeaknesses\nImprovement Suggestions\n\nResume:\n${resumeText}\n\nReturn the result as a JSON object with keys: score, strengths, weaknesses, suggestions.`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama API não está respondendo. Certifique-se de que o Ollama está rodando.");
    }

    const data = await response.json();
    // Ollama retorna { response: string, ... }
      const text = data.response || "";
      // Sanitização básica para evitar prompt injection
      const sanitizedText = text.replace(/[<>]/g, "");
      // Tenta extrair JSON do texto retornado
      const match = sanitizedText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Resposta da IA não contém JSON válido.");
      return JSON.parse(match[0]);
  } catch (e: any) {
    throw new Error(e.message || "Erro ao analisar currículo com IA local.");
  }
}
