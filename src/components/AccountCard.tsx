"use client";
import { useState } from "react";
const PLANS = [
  {
    type: "FREE",
    name: "Free",
    description: "Plano gratuito com recursos básicos.",
    benefits: ["Análise limitada", "Suporte básico"],
  },
  {
    type: "PRO",
    name: "Pro",
    description: "Para profissionais que querem mais.",
    benefits: ["Análises ilimitadas", "Suporte prioritário", "Funcionalidades avançadas"],
  },
  {
    type: "TEAM",
    name: "Team",
    description: "Para equipes e empresas.",
    benefits: ["Tudo do Pro", "Gestão de equipe", "Relatórios compartilhados"],
  },
];
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/AuthContext";

import Modal from "./Modal";
import dynamic from "next/dynamic";

// Lazy loading do formulário de configurações (só baixa o código ao abrir o modal)
const SettingsForm = dynamic(() => import("./SettingsForm"), { ssr: false });

export default function AccountCard() {
  const user = useUser();
  const { setUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  // Fallback para garantir exibição mesmo se user estiver indefinido
  const displayName = user?.name || "Usuário";
  const displayEmail = user?.email || "-";
  // Data de membro real formatada: 00-Mês-0000
  function formatMemberSince(dateStr?: string) {
    if (!dateStr) return "";
    // Converte para Date e ajusta para o fuso de Brasília (GMT-3)
    const date = new Date(dateStr);
    // Usa Intl.DateTimeFormat para garantir o fuso correto
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    // Exemplo: "18 de março de 2026"
    const formatada = formatter.format(date);
    // Transforma para "18-Março-2026"
    const [dia, mes, ano] = formatada.replace(' de ', '-').replace(' de ', '-').split('-');
    // Capitaliza o mês
    const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1);
    return `${dia}-${mesCap}-${ano}`;
  }
  const memberSince = user?.createdAt ? formatMemberSince(user.createdAt) : "01-Janeiro-2024";

  // Avatar grande (inicial ou imagem futura)
  const avatar = (
    <div className="relative mx-auto mb-4">
      <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
        {displayName.charAt(0).toUpperCase()}
      </div>
      <button
        className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-400 text-white rounded-full p-2 shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Alterar foto do perfil"
        // Aqui só visual, não implementa upload real
        onClick={() => alert('Funcionalidade de upload em breve!')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l7-7a2 2 0 00-2.828-2.828l-7 7v3zm0 0v3h3" />
        </svg>
      </button>
    </div>
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleChangePlan(type: string) {
    if (!user || user.subscriptionType === type) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionType: type }),
      });
      if (!res.ok) throw new Error("Erro ao mudar de plano");
      // Buscar usuário atualizado
      const userRes = await fetch("/api/auth/protected", { credentials: "include" });
      if (userRes.ok) {
        const data = await userRes.json();
        if (data.user) setUser({
          id: data.user.userId || data.user.id,
          name: data.user.name,
          email: data.user.email,
          createdAt: data.user.createdAt || "",
          subscriptionType: data.user.subscriptionType || "FREE"
        });
      }
      setMessage("Plano alterado com sucesso!");
    } catch (e) {
      setMessage("Erro ao mudar de plano");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700 p-6 sm:p-8 max-w-md w-full mx-auto mt-8 sm:mt-16 flex flex-col items-center text-center">
      {avatar}
      <h2 className="text-2xl font-semibold text-white mb-1">{displayName}</h2>
      <span className="text-sm text-slate-400 mb-6">{displayEmail}</span>
      <button
        className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        aria-label="Editar informações do usuário"
        onClick={() => setEditOpen(true)}
      >Editar Perfil</button>
      <div className="w-full flex flex-col gap-2 p-4 rounded-xl border border-slate-700 bg-slate-900/50 text-sm text-slate-300 text-left">
        <div><span className="font-medium text-slate-400">Membro desde:</span> <span className="font-semibold text-white ml-1">{memberSince}</span></div>
        <div><span className="font-medium text-slate-400">Plano Atual:</span> <span className="font-semibold text-blue-400 ml-1">
          {user?.subscriptionType === "PRO" ? "Pro" : user?.subscriptionType === "TEAM" ? "Team" : "Free"}
        </span></div>
      </div>

      <div className="w-full mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">Trocar de Plano</h3>
        <div className="flex flex-col gap-4">
          {PLANS.map((plan) => (
            <div key={plan.type} className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${user?.subscriptionType === plan.type ? "border-blue-500 bg-blue-900/30" : "border-slate-700 bg-slate-900/50"}`}>
              <div className="flex-1 text-left">
                <div className="font-bold text-white">{plan.name}</div>
                <div className="text-slate-400 text-sm mb-1">{plan.description}</div>
                <ul className="text-xs text-slate-300 list-disc ml-5">
                  {plan.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 ${user?.subscriptionType === plan.type ? "bg-blue-600 text-white cursor-default" : "bg-slate-700 hover:bg-blue-600 text-blue-200"}`}
                disabled={user?.subscriptionType === plan.type || loading}
                onClick={() => handleChangePlan(plan.type)}
              >
                {user?.subscriptionType === plan.type ? "Plano Atual" : loading ? "Processando..." : `Selecionar`}
              </button>
            </div>
          ))}
        </div>
        {message && <div className="mt-3 text-sm text-center text-green-400">{message}</div>}
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <SettingsForm
          initialName={user?.name}
          initialEmail={user?.email}
          onSuccess={() => setEditOpen(false)}
        />
      </Modal>
    </div>
  );
}
