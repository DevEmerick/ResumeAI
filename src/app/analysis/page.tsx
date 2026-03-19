"use client";

import Navbar from "@/components/Navbar";
import AnalysisCard from "@/components/AnalysisCard";
import { useTranslation } from "@/contexts/I18nContext";


export default function AnalysisPage() {
  const { t, locale } = useTranslation();

  const mockAnalysis = {
    score: 82,
    strengths: locale === "pt" ? [
      "Estrutura e formatação claras",
      "Experiência de trabalho relevante",
      "Fortes verbos de ação",
    ] : [
      "Clear structure and formatting",
      "Relevant work experience",
      "Strong action verbs",
    ],
    weaknesses: locale === "pt" ? [
      "Falta de conquistas quantificáveis",
      "Sem links para portfólio ou LinkedIn",
    ] : [
      "Lack of quantifiable achievements",
      "No links to portfolio or LinkedIn",
    ],
    suggestions: locale === "pt" ? [
      "Adicione resultados mensuráveis à sua seção de experiência.",
      "Inclua links para seus perfis online.",
      "Considere encurtar a seção de resumo.",
    ] : [
      "Add measurable results to your experience section.",
      "Include links to your online profiles.",
      "Consider shortening the summary section.",
    ],
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 w-full flex flex-col">
        <div className="w-full border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">{t("analysis.title", "Resultado da Análise")}</h1>
          </div>
        </div>
        <main className="max-w-6xl w-full flex justify-center mx-auto px-6 py-12">
          <div className="bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700 p-6 sm:p-8 max-w-2xl w-full">
            <AnalysisCard
              score={mockAnalysis.score}
              strengths={mockAnalysis.strengths}
              weaknesses={mockAnalysis.weaknesses}
              suggestions={mockAnalysis.suggestions}
            />
          </div>
        </main>
      </div>
    </>
  );
}
