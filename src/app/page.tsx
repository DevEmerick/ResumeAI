"use client";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/contexts/I18nContext";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <section className="relative flex flex-col items-center justify-center flex-1 w-full text-center px-6 py-24 gap-6 overflow-hidden">
        {/* Efeito de brilho de fundo (Glow) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">ResumeAI</span>
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mx-2">:</span>
          {t("home.title", "Análise de Currículos com")}
          <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{t("home.titleHighlight", "IA")}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
          {t("home.subtitle", "Receba feedback instantâneo e sugestões valiosas para aprimorar seu currículo e conquistar a vaga dos seus sonhos.")}
        </p>
        <a href="/upload" className="mt-4 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
          {t("home.cta", "Começar análise agora")}
        </a>
      </section>
    </>
  );
}
