"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/I18nContext";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, details }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div
      className="bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700 p-6 max-w-md w-full flex flex-col gap-4 transition-transform hover:scale-[1.025] hover:shadow-2xl hover:shadow-black/50 focus-within:ring-2 focus-within:ring-blue-500"
      aria-label={`Funcionalidade: ${title}`}
      tabIndex={0}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl text-blue-500">{icon}</div>
        <div>
          <h3 className="text-3xl font-semibold text-white">{title}</h3>
          <p className="text-base text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => router.push("/upload")}
          aria-label={`Testar funcionalidade: ${title}`}
        >
          {t("fc.try", "Try this feature")}
        </button>
        <button
          className="bg-slate-900/50 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={`feature-details-${title}`}
        >
          {expanded ? t("fc.hide", "Hide details") : t("fc.learn", "Learn more")}
        </button>
      </div>
      {expanded && (
        <div
          id={`feature-details-${title}`}
          className="mt-4 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm transition-all animate-fade-in"
          aria-live="polite"
        >
          {details}
        </div>
      )}
    </div>
  );
};

export default React.memo(FeatureCard);
