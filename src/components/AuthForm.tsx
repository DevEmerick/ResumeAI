"use client";
import InputField from "./InputField";
import { useState } from "react";
import { login, register } from "@/services/authService";
import Link from "next/link";
import { useTranslation } from "@/contexts/I18nContext";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [passwordWarnings, setPasswordWarnings] = useState<string[]>([]);

  function validatePassword(pw: string): string[] {
    const warnings = [];
    if (pw.length < 8) warnings.push("Mínimo de 8 caracteres");
    if (!/[A-Z]/.test(pw)) warnings.push("Ao menos uma letra maiúscula");
    if (!/[a-z]/.test(pw)) warnings.push("Ao menos uma letra minúscula");
    if (!/[0-9]/.test(pw)) warnings.push("Ao menos um número");
    if (!/[^A-Za-z0-9]/.test(pw)) warnings.push("Ao menos um caractere especial");
    return warnings;
  }

  function handlePasswordChange(pw: string) {
    setPassword(pw);
    setPasswordWarnings(validatePassword(pw));
  }

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = type === "register"
      ? { name, email, password, confirmPassword }
      : { email, password };
    if (type === "register") {
      const warnings = validatePassword(password);
      setPasswordWarnings(warnings);
      if (warnings.length > 0) {
        setError(t("auth.passwordRequirements", "A senha não atende aos requisitos."));
        setLoading(false);
        return;
      }
    }
    try {
      const data = type === "login" ? await login({ email, password }) : await register(body as any);
      
      if (type === "register" && data.success) {
        setSuccess(t("auth.registerSuccess", "Usuário registrado com sucesso! Redirecionando..."));
        setError("");
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = "/upload";
        }, 1200);
      } else if (type === "login") {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || t("auth.connectionError", "Erro de conexão. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label={type === "login" ? "Formulário de login" : "Formulário de registro"}>
      {type === "register" && (
        <InputField label="Nome" type="text" value={name} onChange={setName} />
      )}
      <InputField label="Email" type="email" value={email} onChange={setEmail} />
      
      <div className="flex flex-col gap-1">
        <InputField label="Senha" type="password" value={password} onChange={handlePasswordChange} />
        {type === "login" && (
          <Link href="/forgot-password" className="text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors self-end -mt-2 mb-2" aria-label="Recuperar senha esquecida">Esqueceu a senha?</Link>
        )}
      </div>

      {type === "register" && (
        <InputField label="Confirmar Senha" type="password" value={confirmPassword} onChange={setConfirmPassword} />
      )}
      {type === "register" && password && passwordWarnings.length > 0 && (
        <ul className="text-amber-400 text-xs mt-2" aria-live="polite">
          {passwordWarnings.map((w, i) => (
            <li key={i}>• {w}</li>
          ))}
        </ul>
      )}
      {error && <div className="bg-red-900/20 text-red-400 border border-red-900/50 p-3 rounded-lg text-sm mt-2 font-medium" role="alert" aria-live="assertive">{error}</div>}
      {success && <div className="bg-green-900/20 text-green-400 border border-green-900/50 p-3 rounded-lg text-sm mt-2 font-medium" role="status" aria-live="polite">{success}</div>}
      <button
        className={`w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative ${loading || redirecting ? "opacity-60 cursor-not-allowed" : ""}`}
        type="submit"
        aria-label={type === "login" ? "Entrar" : "Registrar"}
        disabled={loading || redirecting}
      >
        {(loading || redirecting) ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            {redirecting ? "Redirecionando..." : (type === "login" ? "Entrando..." : "Registrando...")}
          </span>
        ) : (
          type === "login" ? "Entrar" : "Registrar"
        )}
      </button>
      {/* Animação de transição suave ao redirecionar */}
      {redirecting && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50 transition-opacity animate-fadeOut">
          <div className="bg-slate-800/90 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-slate-700">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-white text-lg font-semibold">Redirecionando para upload...</span>
          </div>
        </div>
      )}
    </form>
  );
}
