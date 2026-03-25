export const analyzeResume = async (file: File, locale?: string, onStatus?: (status: string) => void) => {
  const formData = new FormData();
  formData.append("file", file);
  if (locale) {
    formData.append("locale", locale);
  }

  // Chama endpoint assíncrono
  const res = await fetch("/api/analysis-async", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  if (!res.ok) {
    let errorMessage = "Falha ao analisar currículo.";
    try {
      const errorData = await res.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch (e) {
      // Se não conseguir extrair erro detalhado, mantém mensagem padrão
    }
    // Exibe mensagem detalhada para o usuário
    throw new Error(errorMessage);
  }

  const data = await res.json();
  if (!data.analysisId) throw new Error("ID da análise não retornado");

  // Polling do status/resultados
  let status = "pending";
  let result = null;
  let error = null;
  let attempts = 0;
  while (status === "pending" || status === "processing") {
    if (onStatus) onStatus(status);
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await fetch(`/api/analysis-status?id=${data.analysisId}`);
    if (!statusRes.ok) throw new Error("Erro ao consultar status da análise");
    const statusData = await statusRes.json();
    status = statusData.status;
    result = statusData.analysis;
    error = statusData.error;
    attempts++;
    if (attempts > 60) throw new Error("Tempo limite excedido para análise");
  }
  if (status === "done") {
    try {
      return typeof result === "string" ? JSON.parse(result) : result;
    } catch {
      return { result };
    }
  }
  if (status === "error") throw new Error(error || "Erro ao analisar currículo");
  throw new Error("Análise não finalizada");
};
