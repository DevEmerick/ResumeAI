"use client";

import Navbar from "@/components/Navbar";
import UploadCard from "@/components/UploadCard";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { analyzeResume } from "@/services/resumeService";
import { useTranslation } from "@/contexts/I18nContext";
import dynamic from "next/dynamic";

// Lazy loading do componente de resultado (só baixa o JS após a análise estar pronta)
const AnalysisResultCard = dynamic(() => import("@/components/AnalysisResultCard"), { ssr: false });

export default function UploadPage() {
  const { analysis, setAnalysis, loading, setLoading } = useAnalysis();
  const { t, locale } = useTranslation();

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setAnalysis("");
    
    try {
      const analysisObj = await analyzeResume(file, locale);
      setAnalysis(analysisObj);
    } catch (error) {
      console.error(error);
      setAnalysis({ result: t("upload.errorAnalyzing", "Error analyzing resume") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex flex-col items-center overflow-auto">
        <div className="max-w-3xl w-full mx-auto px-6 py-16 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-4xl font-semibold text-white">{t("upload.title", "Envie seu currículo para análise")}</h1>
            <p className="text-lg text-slate-300 text-center max-w-md">
              {t("upload.subtitle", "Faça upload do seu currículo em PDF ou DOCX e receba uma análise instantânea com sugestões de melhoria. O processo é seguro e privado.")}
            </p>
          </div>
          <UploadCard onAnalyze={handleAnalyze} loading={loading} />
          {analysis && (
            <div className="mt-8 w-full">
              <AnalysisResultCard analysis={analysis} loading={loading} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
