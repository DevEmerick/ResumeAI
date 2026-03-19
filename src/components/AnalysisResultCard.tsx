"use client";
import React, { useState, useEffect } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import type { AnalysisType } from "@/contexts/AnalysisContext";
import { useTranslation } from "@/contexts/I18nContext";

interface AnalysisResultCardProps {
  analysis: AnalysisType;
  loading: boolean;
}


function parseAnalysis(analysis: AnalysisType) {
  try {
    if (!analysis) return null;
    if (typeof analysis === 'object') return analysis;
    // Se for JSON válido, retorna objeto
    return JSON.parse(analysis);
  } catch {
    // Se não for JSON, retorna texto plano
    return analysis;
  }
}

export default function AnalysisResultCard({ analysis, loading }: AnalysisResultCardProps) {
  const parsed = parseAnalysis(analysis);
  const { t, locale } = useTranslation();
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");
  const [translatedData, setTranslatedData] = useState<any>(null);

  useEffect(() => {
    setTranslatedData(null);
    setTranslationError("");
  }, [locale]);

  const handleTranslate = async () => {
    if (translatedData || !parsed) return;
    setTranslating(true);
    setTranslationError("");
    
    try {
      const translateText = async (text: string) => {
        if (!text) return "";
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${locale}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Translation failed");
        const data = await res.json();
        return data[0].map((item: any) => item[0]).join("");
      };

      const translateArray = async (arr: string[]) => {
        if (!arr || arr.length === 0) return [];
        return Promise.all(arr.map((text: string) => translateText(text)));
      };

      if (typeof parsed === 'string') {
        const tString = await translateText(parsed);
        setTranslatedData(tString);
      } else {
        const [tStrengths, tWeaknesses, tSuggestions] = await Promise.all([
          translateArray(parsed.strengths),
          translateArray(parsed.weaknesses),
          translateArray(parsed.suggestions),
        ]);
        setTranslatedData({ ...parsed, strengths: tStrengths, weaknesses: tWeaknesses, suggestions: tSuggestions });
      }
    } catch (error) {
      console.error("[AnalysisResultCard] Erro na tradução:", error);
      setTranslationError("Não foi possível traduzir no momento.");
    } finally {
      setTranslating(false);
    }
  };

  const displayData = translatedData || parsed;

  return (
    <div
      className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 w-full max-w-2xl mx-auto mt-8 shadow-xl text-slate-200 transition-all duration-500"
      aria-label="Resultado detalhado da análise do currículo"
      tabIndex={0}
    >
      {/* Botão de Tradução Frontend */}
      {!loading && displayData && !translatedData && (
        <div className="flex justify-end mb-2">
          <button onClick={handleTranslate} disabled={translating} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1" aria-label="Traduzir resultados da análise" title="Traduzir resultados da análise">
            {translating ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
            {translating ? "Traduzindo..." : `Traduzir para ${locale === 'pt' ? 'Português' : 'Inglês'}`}
          </button>
        </div>
      )}
      {translationError && <div className="text-red-400 text-xs text-right mb-2" role="alert">{translationError}</div>}

      <h2 className="text-2xl font-semibold text-white mb-8 text-center">{t("result.title", "Analysis Result")}</h2>
      {loading && !analysis ? (
        <div className="flex flex-col items-center justify-center py-12" aria-live="polite">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          <p className="text-slate-400 font-medium">{t("result.analyzing", "Analysing your resume with AI...")}</p>
        </div>
      ) : typeof displayData === 'string' ? (
        <div className="text-slate-300 whitespace-pre-line text-base bg-slate-900/50 p-6 rounded-xl border border-slate-700">{displayData}</div>
      ) : displayData ? (
        <>
          {/* Score */}
          <div className="mb-8 flex flex-col items-center">
            <span className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">{t("result.overallScore", "Overall Score")}</span>
            <div className="text-7xl font-extrabold text-blue-500 drop-shadow-sm" aria-live="polite">{displayData.score ?? '--'}<span className="text-3xl text-slate-600">/100</span></div>
          </div>
          {/* Strengths */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="w-6 h-6 text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-green-400">{t("result.strengths", "Strengths")}</h3>
            </div>
            <ul className="space-y-2 ml-8 text-slate-300">
              {displayData.strengths && displayData.strengths.length > 0 ? displayData.strengths.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 bg-green-900/20 p-3 rounded-lg border border-green-900/30" tabIndex={0}><span className="text-green-400 mt-0.5">•</span> <span>{item}</span></li>
              )) : <li className="text-slate-500 italic">{t("result.noStrengths", "No strengths found")}</li>}
            </ul>
          </div>
          {/* Weaknesses */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-red-400">{t("result.weaknesses", "Weaknesses")}</h3>
            </div>
            <ul className="space-y-2 ml-8 text-slate-300">
              {displayData.weaknesses && displayData.weaknesses.length > 0 ? displayData.weaknesses.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 bg-red-900/20 p-3 rounded-lg border border-red-900/30" tabIndex={0}><span className="text-red-400 mt-0.5">•</span> <span>{item}</span></li>
              )) : <li className="text-slate-500 italic">{t("result.noWeaknesses", "No weaknesses found")}</li>}
            </ul>
          </div>
          {/* Suggestions */}
          <div>
            <div className="flex items-center mb-2">
              <LightBulbIcon className="w-6 h-6 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-blue-400">{t("result.suggestions", "Suggestions for Improvement")}</h3>
            </div>
            <ul className="space-y-2 ml-8 text-slate-300">
              {displayData.suggestions && displayData.suggestions.length > 0 ? displayData.suggestions.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 bg-blue-900/20 p-3 rounded-lg border border-blue-900/30" tabIndex={0}><span className="text-blue-400 mt-0.5">•</span> <span>{item}</span></li>
              )) : <li className="text-slate-500 italic">{t("result.noSuggestions", "No suggestions provided")}</li>}
            </ul>
          </div>
        </>
      ) : (
        <div className="bg-red-900/20 text-red-400 text-center p-6 rounded-xl border border-red-900/50" role="alert" aria-live="assertive">
          <p className="font-semibold mb-2">{t("result.failedParse", "Failed to parse analysis result:")}</p>
          <span className="text-slate-300 text-sm font-mono break-all">{typeof analysis === 'string' ? analysis : JSON.stringify(analysis)}</span>
        </div>
      )}
    </div>
  );
}
