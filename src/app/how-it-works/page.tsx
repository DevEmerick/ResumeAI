"use client";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import { useTranslation } from "@/contexts/I18nContext";

export default function HowItWorksPage() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <section className="w-full pt-16 pb-8 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white">{t("hiw.title", "Como Funciona")}</h1>
            <p className="text-slate-400 text-lg">{t("hiw.subtitle", "Três passos simples para um currículo de sucesso")}</p>
          </div>
          <HowItWorks />
        </div>
      </section>
    </>
  );
}
