"use client";
import React from "react";
import { useTranslation } from "@/contexts/I18nContext";

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();
  const steps = [
    {
      number: 1,
      title: t("hiw.s1.title", "Upload your resume"),
      description: t("hiw.s1.desc", "Drag and drop your PDF resume to start the analysis."),
    },
    {
      number: 2,
      title: t("hiw.s2.title", "AI analyzes your resume"),
      description: t("hiw.s2.desc", "Our AI evaluates structure, keywords and clarity."),
    },
    {
      number: 3,
      title: t("hiw.s3.title", "Receive improvement suggestions"),
      description: t("hiw.s3.desc", "Get actionable insights to improve your chances of getting hired."),
    },
  ];

  return (
    <section className="w-full" aria-label="Como funciona o ResumeAI">
      <div className="max-w-6xl w-full mx-auto px-6 py-24 flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-3 gap-10 w-full mb-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8 flex flex-col items-center text-center shadow-xl transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl hover:bg-slate-800 focus-within:scale-[1.025] focus-within:shadow-2xl"
              tabIndex={0}
              aria-label={`Passo ${step.number}: ${step.title}`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xl font-bold mb-6 ring-4 ring-blue-600/10">{step.number}</div>
              <h3 className="text-white text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-slate-400 text-base leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <a
          href="/upload"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-3 transition text-xl"
          aria-label="Começar análise"
        >
          {t("hiw.cta", "Começar análise")}
        </a>
      </div>
    </section>
  );
};

export default HowItWorks;
