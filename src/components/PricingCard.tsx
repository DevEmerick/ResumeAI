// --- PRICING CARD PRO v1 (referência visual) ---
// Preço: R$29/mês, valor e barra juntos, "mês" na mesma linha
// Features: Análises ilimitadas, Reescrita de currículo, Otimização de palavras-chave
// Botão: Assinar Pro
// Classe: text-4xl font-extrabold mb-4 text-white
"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
  ctaLabel: string;
  cta: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, features, highlight, ctaLabel, cta }) => {
  const router = useRouter();
  return (
    <div
      className={`bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700 p-8 max-w-md w-full flex flex-col gap-4 transition-transform hover:scale-[1.025] hover:shadow-2xl hover:shadow-black/50 focus-within:ring-2 focus-within:ring-blue-500 ${highlight ? "border-blue-500 ring-1 ring-blue-500 bg-slate-800/80" : ""}`}
      tabIndex={0}
      aria-label={name}
    >
      <h3 className={`text-3xl font-semibold mb-2 ${highlight ? "text-blue-400" : "text-white"}`}>{name}</h3>
      {highlight ? (
        <div className="flex flex-col items-center mb-4">
          <span className="text-4xl font-extrabold text-white">{price}</span>
          <span className="text-base text-slate-300 mt-2">mês</span>
        </div>
      ) : (
        <div className="text-4xl font-extrabold mb-4 text-white">{price}</div>
      )}
      <ul className="flex-1 mb-6 space-y-2 text-base text-slate-400">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            {f}
          </li>
        ))}
      </ul>
      <button
        className={`mt-auto ${highlight ? "bg-blue-600 hover:bg-blue-500 text-white border-transparent" : "bg-slate-900/50 hover:bg-slate-800 text-slate-300 border border-slate-700"} font-medium rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
        onClick={() => router.push(cta)}
        aria-label={ctaLabel}
      >
        {ctaLabel}
      </button>
    </div>
  );
};

export default React.memo(PricingCard);
