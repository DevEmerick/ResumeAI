"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { AnalysisHistory } from "@/types/analysisHistory";
import AnalysisHistorySection from "@/components/AnalysisHistorySection";
import { useTranslation } from "@/contexts/I18nContext";


export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<(AnalysisHistory & { user?: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analysis/history`)
      .then(res => res.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("[Dashboard] Erro ao buscar histórico global:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        <div className="flex flex-col w-full gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-white">{t("dashboard.title", "Dashboard")}</h1>
            <p className="text-slate-400 text-sm">{t("dashboard.subtitle", "Aqui você acompanha suas análises recentes e estatísticas gerais.")}</p>
          </div>
          
          <AnalysisHistorySection />

          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-xl flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-white">{t("dashboard.leaderboard", "Leaderboard Global")}</h2>
            {loading ? (
              <div className="w-full flex flex-col gap-4 mt-2" role="status" aria-live="polite">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl animate-pulse">
                    <div className="h-4 bg-slate-600 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-600 rounded w-1/4 hidden sm:block"></div>
                    <div className="h-4 bg-slate-600 rounded w-1/6"></div>
                  </div>
                ))}
                <span className="sr-only">Carregando histórico...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-slate-300 font-medium mb-1">{t("dashboard.noAnalysis", "Nenhuma análise encontrada")}</p>
                <p className="text-slate-500 text-sm max-w-sm">{t("dashboard.noAnalysisDesc", "Parece que ainda não existem currículos processados no histórico global.")}</p>
              </div>
            ) : (
              <RankingTable history={history} user={user} />
            )}
          </div>
        </div>
        {/* Footer removido, já está no layout global */}
      </div>
    </>
  );
}

function RankingTable({ history, user }: { history: (AnalysisHistory & { user?: any })[]; user: any }) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  // Extrai score e ordena
  const historyWithScore = history.map((item) => {
    let score = null;
    try {
      const parsed = JSON.parse(item.analysis);
      if (typeof parsed.score === "number") score = parsed.score;
    } catch {}
    return { ...item, score };
  });
  // Ordena por score decrescente
  const sorted = [...historyWithScore].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  // Top 10
  const top = showAll ? sorted : sorted.slice(0, 10);
  // Posição do usuário logado
  const userIdx = sorted.findIndex((item) => item.userId === user?.id);
  const userRank = userIdx >= 0 ? userIdx + 1 : null;
  const userScore = userIdx >= 0 ? sorted[userIdx].score : null;
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
            <th className="py-3 px-4 text-slate-400 font-semibold text-sm whitespace-nowrap">{t("dashboard.table.rank", "Rank")}</th>
            <th className="py-3 px-4 text-slate-400 font-semibold text-sm whitespace-nowrap">{t("dashboard.table.name", "Nome")}</th>
            <th className="py-3 px-4 text-slate-400 font-semibold text-sm whitespace-nowrap">{t("dashboard.table.score", "Score")}</th>
            <th className="py-3 px-4 text-slate-400 font-semibold text-sm whitespace-nowrap">{t("dashboard.table.date", "Data")}</th>
            </tr>
          </thead>
          <tbody>
            {top.map((item, idx) => (
            <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-700/40 transition-colors">
              <td className="py-3 px-4 text-slate-200 text-sm">{idx + 1}</td>
              <td className="py-3 px-4 text-slate-200 text-sm whitespace-nowrap">{item.user?.name || "-"}</td>
              <td className="py-3 px-4 text-slate-200 text-sm font-medium">{item.score ?? '-'}</td>
              <td className="py-3 px-4 text-slate-400 text-sm whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length > 10 && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-4 py-2 transition shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? t("dashboard.seeLess", "Ver menos") : t("dashboard.seeMore", "Ver mais")}
          </button>
        </div>
      )}
      {userRank && userRank > 10 && (
        <div className="mt-8 text-center text-slate-300 text-sm">
          {t("dashboard.yourPosition", "Sua posição:")} <span className="font-bold">{userRank}º</span> — Score: <span className="font-bold">{userScore ?? '-'}</span>
        </div>
      )}
    </>
  );
}
