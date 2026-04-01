"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useTranslation } from "@/contexts/I18nContext";

interface AnalysisCardProps {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ score, strengths, weaknesses, suggestions }) => {
  const { t, locale } = useTranslation();
  const user = useUser();
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");
  const [translatedData, setTranslatedData] = useState<{
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
  } | null>(null);

  useEffect(() => {
    // Limpa a tradução se o usuário mudar de idioma pela Navbar
    setTranslatedData(null);
    setTranslationError("");
  }, [locale]);

  const handleTranslate = async () => {
    if (translatedData) return;
    setTranslating(true);
    setTranslationError("");
    
    try {
      // Fallback: Tradução 100% no Frontend usando Google Translate API pública
      const translateArray = async (arr: string[]) => {
        if (!arr || arr.length === 0) return [];
        return Promise.all(
          arr.map(async (text) => {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${locale}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Translation failed");
            const data = await res.json();
            return data[0].map((item: any) => item[0]).join("");
          })
        );
      };

      const [tStrengths, tWeaknesses, tSuggestions] = await Promise.all([
        translateArray(strengths),
        translateArray(weaknesses),
        translateArray(suggestions),
      ]);

      setTranslatedData({
        strengths: tStrengths,
        weaknesses: tWeaknesses,
        suggestions: tSuggestions,
      });
    } catch (error) {
      console.error("[AnalysisCard] Erro na tradução:", error);
      setTranslationError("Não foi possível traduzir no momento.");
    } finally {
      setTranslating(false);
    }
  };

  const displayStrengths = translatedData?.strengths || strengths;
  const displayWeaknesses = translatedData?.weaknesses || weaknesses;
  const displaySuggestions = translatedData?.suggestions || suggestions;

  const isPremium = user?.subscriptionType === "PRO" || user?.subscriptionType === "TEAM";

  return (
    <div
      className="w-full flex flex-col gap-4 text-slate-200"
      aria-label="Resultado da análise do currículo"
      tabIndex={0}
    >
      {/* Botão de Tradução Frontend */}
      <div className="flex justify-end mb-2">
        {!translatedData && (
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Traduzir resultados da análise"
            title="Traduzir resultados da análise"
          >
            {translating ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            )}
            {translating ? "Traduzindo..." : `Traduzir para ${locale === 'pt' ? 'Português' : 'Inglês'}`}
          </button>
        )}
      </div>
      {translationError && <div className="text-red-400 text-xs text-right mb-2" role="alert">{translationError}</div>}

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">{t("result.title", "Analysis Result")}</h2>
        <div className="text-6xl font-extrabold text-blue-500 drop-shadow-sm" aria-live="polite">{score}<span className="text-3xl text-slate-500">/100</span></div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">{t("result.strengths", "Strengths")}</h3>
        <ul className="space-y-2 text-slate-300">
          {displayStrengths.length > 0 ? displayStrengths.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-green-900/20 p-3 rounded-lg border border-green-900/30 transition-colors hover:border-green-800/50" tabIndex={0}><span className="text-green-400 mt-0.5">•</span> <span>{item}</span></li>
          )) : <li className="text-slate-500 italic">{t("result.noStrengths", "No strengths found")}</li>}
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">{t("result.weaknesses", "Weaknesses")}</h3>
        <ul className="space-y-2 text-slate-300">
          {displayWeaknesses.length > 0 ? displayWeaknesses.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-red-900/20 p-3 rounded-lg border border-red-900/30 transition-colors hover:border-red-800/50" tabIndex={0}><span className="text-red-400 mt-0.5">•</span> <span>{item}</span></li>
          )) : <li className="text-slate-500 italic">{t("result.noWeaknesses", "No weaknesses found")}</li>}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">{t("result.suggestions", "Suggestions for Improvement")}</h3>
        {isPremium ? (
          <ul className="space-y-2 text-slate-300">
            {displaySuggestions.length > 0 ? displaySuggestions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-blue-900/20 p-3 rounded-lg border border-blue-900/30 transition-colors hover:border-blue-800/50" tabIndex={0}><span className="text-blue-400 mt-0.5">•</span> <span>{item}</span></li>
            )) : <li className="text-slate-500 italic">{t("result.noSuggestions", "No suggestions provided")}</li>}
          </ul>
        ) : (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-center">
            <div className="font-semibold mb-2">Recurso premium</div>
            <div className="mb-2">Faça upgrade para <span className="text-blue-400 font-bold">Pro</span> ou <span className="text-blue-400 font-bold">Team</span> para ver sugestões detalhadas de melhoria.</div>
            <a href="/account" className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition">Fazer upgrade</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisCard;
