"use client";
import { getUserAnalysisHistory, deleteAnalysisHistory } from "@/services/analysisHistoryService";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/I18nContext";
import Modal from "./Modal";
import dynamic from "next/dynamic";

// Lazy loading do AnalysisCard, pois ele só é exibido sob demanda dentro do Modal
const AnalysisCard = dynamic(() => import("./AnalysisCard"), { ssr: false });

function RawAnalysisTranslator({ text }: { text: string }) {
  const { locale } = useTranslation();
  const [translated, setTranslated] = useState("");
  const [translating, setTranslating] = useState(false);

  useEffect(() => { setTranslated(""); }, [locale]);

  const handleTranslate = async () => {
    if (translated) return;
    setTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${locale}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      setTranslated(data[0].map((item: any) => item[0]).join(""));
    } catch (err) {
      console.error(err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!translated && (
        <button onClick={handleTranslate} disabled={translating} className="self-end flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1">
          {translating ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
          {translating ? "Traduzindo..." : `Traduzir para ${locale === 'pt' ? 'Português' : 'Inglês'}`}
        </button>
      )}
      <div className="text-base text-slate-300 whitespace-pre-wrap break-words mb-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
        {translated || text}
      </div>
    </div>
  );
}

export default function AnalysisHistorySection({ history, setHistory, hideTitle = false }: { history: any[], setHistory: (h: any[]) => void, hideTitle?: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const { t } = useTranslation();

  // Função para deletar análise
    async function handleDeleteAnalysis(id: string) {
      setDeletingId(id);
      setDeleteError("");
      try {
        await deleteAnalysisHistory(id);
        // Remove da lista local
        setHistory(history.filter((a) => a.id !== id));
        if (selectedAnalysis?.id === id) {
          setModalOpen(false);
        }
      } catch (err: any) {
        setDeleteError(t("history.deleteError", "Erro ao deletar análise. Tente novamente."));
      } finally {
        setDeletingId(null);
      }
  }

  if (!history) return null;

  return (
    <div
      className="w-full"
      aria-label="Histórico de análises do usuário"
      tabIndex={0}
    >
      {!hideTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-2xl font-semibold text-white">{t("history.title", "Últimas análises")}</h3>
          {deleteError && <div className="text-red-400 text-sm font-medium bg-red-900/30 px-3 py-1.5 rounded-lg border border-red-900/50" role="alert">{deleteError}</div>}
        </div>
      )}
      {hideTitle && deleteError && (
        <div className="mb-4">
          <div className="text-red-400 text-sm font-medium bg-red-900/30 px-3 py-1.5 rounded-lg border border-red-900/50" role="alert">{deleteError}</div>
        </div>
      )}
      {history.length === 0 ? (
        <div className="text-sm text-slate-400 bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-700 text-center">{t("history.empty", "Nenhuma análise encontrada no seu histórico.")}</div>
      ) : (
        <div className="flex flex-col gap-8">
          {[...history]
            .map((item) => {
              let parsed = null;
              try {
                parsed = typeof item.analysis === "string" ? JSON.parse(item.analysis) : item.analysis;
              } catch {
                parsed = null;
              }
              return { ...item, parsed, score: parsed && typeof parsed.score === "number" ? parsed.score : null };
            })
            .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
            .map(item => {
              // 'parsed' já está em item.parsed devido ao processamento anterior
              return (
                <div key={item.id} className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700 rounded-xl p-5 bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.015] hover:border-blue-500 group">
                  {/* Corpo clicável do card */}
                  <div
                  className="flex-1 w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg pr-8 sm:pr-0"
                  onClick={() => {
                    setSelectedAnalysis(item);
                    setModalOpen(true);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedAnalysis(item);
                      setModalOpen(true);
                    }
                  }}
                  aria-label={`Ver análise de ${item.fileName}`}
                >
                  <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors duration-200">{item.fileName}</div>
                      <div className="text-sm text-slate-400">{new Date(item.createdAt).toLocaleString()}</div>
                  </div>
                    {item.parsed && typeof item.parsed === "object" && item.parsed.score !== undefined ? (
                      <div className="text-blue-400 font-bold text-xl">{t("dashboard.table.score", "Score")}: {item.parsed.score}/100</div>
                    ) : (
                      <div className="text-sm text-slate-400 mt-1 whitespace-pre-wrap break-words line-clamp-2">{item.analysis}</div>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-blue-400 text-sm font-medium" aria-hidden="true">
                    {t("history.details", "Ver detalhes")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>

                {/* Botão de Excluir */}
                <div className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto flex items-center z-10">
                  <button
                      className={`p-2 rounded-lg border border-transparent text-slate-500 hover:text-red-400 hover:bg-red-900/30 hover:border-red-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${deletingId === item.id ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t("history.deleteConfirm", "Tem certeza que deseja apagar esta análise? Esta ação não pode ser desfeita."))) {
                        handleDeleteAnalysis(item.id);
                      }
                    }}
                    disabled={deletingId === item.id}
                    aria-label={t("history.delete", "Apagar análise")}
                    title={t("history.delete", "Apagar análise")}
                  >
                    {deletingId === item.id ? (
                      <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            {selectedAnalysis && (
              <>
                <div className="mb-6 pr-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight break-words">{selectedAnalysis.fileName}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    {new Date(selectedAnalysis.createdAt).toLocaleString()}
                  </div>
                </div>
                {selectedAnalysis.parsed && typeof selectedAnalysis.parsed === "object" && selectedAnalysis.parsed.score !== undefined ? (
                  <AnalysisCard
                    score={selectedAnalysis.parsed.score}
                    strengths={selectedAnalysis.parsed.strengths || []}
                    weaknesses={selectedAnalysis.parsed.weaknesses || []}
                    suggestions={selectedAnalysis.parsed.suggestions || []}
                  />
                ) : (
                <RawAnalysisTranslator text={selectedAnalysis.analysis} />
                )}
              </>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}
