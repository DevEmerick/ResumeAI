import { AnalysisHistory } from "@/types/analysisHistory";

export const getUserAnalysisHistory = async (userId?: string): Promise<AnalysisHistory[]> => {
  const url = userId ? `/api/analysis/history?userId=${userId}` : `/api/analysis/history`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar histórico de análises");
  return res.json();
};

export const deleteAnalysisHistory = async (id: string): Promise<void> => {
  const res = await fetch(`/api/analysis/history?id=${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro ao deletar análise");
};