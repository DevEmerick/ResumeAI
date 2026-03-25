
"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { AnalysisHistory } from "@/types/analysisHistory";
import AnalysisHistorySection from "@/components/AnalysisHistorySection";
import { useTranslation } from "@/contexts/I18nContext";

    function RankingTable({ history, user }: { history: (AnalysisHistory & { user?: any })[]; user: any }) {
      const [showAll, setShowAll] = useState(false);
      const { t } = useTranslation();
      const historyWithScore = history.map((item) => {
        let score = null;
        try {
          const parsed = JSON.parse(item.analysis);
          if (typeof parsed.score === "number") score = parsed.score;
        } catch {}
        return { ...item, score };
      });
      const sorted = [...historyWithScore].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
      const top = showAll ? sorted : sorted.slice(0, 10);
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
              {t("dashboard.yourPosition", "Sua posição:")} <span className="font-bold">{userRank}º</span> — Score: <span className="font-bold">{userScore ?? '-'} </span>
            </div>
          )}
        </>
      );
    }

function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<(AnalysisHistory & { user?: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const isFree = user?.subscriptionType === "FREE";

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
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8 relative">
        {isFree && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[2px] rounded-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Acesso restrito ao Dashboard</h2>
              <p className="text-slate-300 mb-4 max-w-md">Usuários do plano <span className="font-bold text-blue-400">Free</span> não têm acesso ao dashboard global. Faça upgrade para o plano <span className="font-bold text-yellow-400">Pro</span> ou <span className="font-bold text-green-400">Team</span> para desbloquear estatísticas e rankings.</p>
              <a href="/pricing" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-6 py-3 transition shadow focus:outline-none focus:ring-2 focus:ring-blue-500">Ver planos</a>
            </div>
          </div>
        )}
        <div className={isFree ? "pointer-events-none blur-sm select-none" : ""}>
          <div className="flex flex-col w-full gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-white">{t("dashboard.title", "Dashboard")}</h1>
              <p className="text-slate-400 text-sm">{t("dashboard.subtitle", "Aqui você acompanha suas análises recentes e estatísticas gerais.")}</p>
            </div>
            <AnalysisHistorySection />
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-xl flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-white">{t("dashboard.leaderboard", "Leaderboard Global")}</h2>
              {loading ? (
                <div className="text-center py-8">
                  <span className="text-slate-400">{t("dashboard.loading", "Carregando...")}</span>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm max-w-sm">{t("dashboard.noAnalysisDesc", "Parece que ainda não existem currículos processados no histórico global.")}</p>
                </div>
              ) : (
                <RankingTable history={history} user={user} />
              )}
            </div>
          </div>
        </div>
        {/* Footer removido, já está no layout global */}
      </div>
    </>
  );
}

export default Dashboard;

