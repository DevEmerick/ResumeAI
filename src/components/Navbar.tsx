
"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { useActivePath } from "@/lib/useActivePath";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";

export default function Navbar() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { locale, setLocale, t } = useTranslation();

  const navLinks = [
    { href: "/how-it-works", label: t("nav.howItWorks", locale === 'pt' ? "Como funciona" : "How it works") },
    { href: "/pricing", label: t("nav.pricing", locale === 'pt' ? "Planos" : "Pricing") },
  ];
  if (isLoggedIn) {
    navLinks.push({ href: "/dashboard", label: t("nav.dashboard", locale === 'pt' ? "Dashboard" : "Dashboard") });
    navLinks.push({ href: "/upload", label: t("nav.analysis", locale === 'pt' ? "Análise" : "Analysis") });
  }
  const activePath = useActivePath(navLinks.map(l => l.href));

  // Avatar simples (iniciais, sem imagem)
  const avatar = user ? (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold mr-2 border-2 border-white shadow-sm">
      {user.name && typeof user.name === 'string' && user.name.length > 0
        ? user.name.charAt(0).toUpperCase()
        : user.email && typeof user.email === 'string' && user.email.length > 0
          ? user.email.charAt(0).toUpperCase()
          : "?"}
    </span>
  ) : null;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 transition-colors duration-300 shadow-sm" aria-label="Barra de navegação principal">
      <nav className="max-w-6xl mx-auto px-12 sm:px-6 grid grid-cols-3 items-center h-16 relative">
        {/* Logo */}
        <div className="flex items-center min-w-[140px]">
          <Link href="/" className="text-2xl font-bold tracking-tight text-blue-500 hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">ResumeAI</Link>
        </div>

        {/* Links desktop centralizados - grid garante centralização */}
        <div className="hidden md:flex justify-center gap-6 min-w-0">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={
                `text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ` +
                (activePath === link.href
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-slate-400 hover:text-white")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Ações desktop à direita */}
        <div className="hidden md:flex items-center gap-1.5 min-w-[140px] justify-end">
          <button
            onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}
            className="flex items-center justify-center mr-2 w-8 h-8 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-700"
            aria-label="Trocar idioma"
            title={`Mudar para ${locale === 'pt' ? 'Inglês' : 'Português'}`}
          >
            {locale === 'pt' ? 'PT' : 'EN'}
          </button>
          {isLoggedIn && user ? (
            <>
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-3 py-1.5 text-sm font-medium shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-w-[110px] cursor-pointer h-10"
                  onClick={() => setDropdownOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  aria-label="Abrir menu do usuário"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar menor */}
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-700 text-white font-bold border-2 border-white shadow-sm text-base">{user.name && typeof user.name === 'string' && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : user.email && typeof user.email === 'string' && user.email.length > 0 ? user.email.charAt(0).toUpperCase() : "?"}</span>
                  <div className="flex flex-col items-start justify-center leading-tight ml-1">
                    <span className="text-sm text-white/80 font-semibold">{t("nav.hello", "Olá")},</span>
                    <span className="font-bold text-white text-[15px] leading-tight">{user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user.email}</span>
                  </div>
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-800/80 text-xs font-semibold text-yellow-200 border border-yellow-500 flex items-center gap-1 backdrop-blur-sm shadow-sm min-w-[32px] justify-center" style={{marginTop: 1}} title={t("nav.tokens", "Tokens disponíveis")}>{user.tokens ?? 0} <FontAwesomeIcon icon={faCoins} className="text-yellow-400 w-3.5 h-3.5" /></span>
                  <svg className="ml-1 w-4 h-4 text-blue-200 transition" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 flex flex-col py-2 animate-fade-in" role="menu" aria-label="Menu do usuário">
                    <Link href="/account" className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition" role="menuitem" tabIndex={0}>{t("nav.account", "Minha Conta")}</Link>
                    <button
                      className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-red-400 transition text-left"
                      onClick={logout}
                      role="menuitem"
                      tabIndex={0}
                    >{t("nav.logout", "Sair")}</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("nav.login", "Conectar")}</Link>
              <Link href="/register" className="ml-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{t("nav.register", "Criar Conta")}</Link>
            </>
          )}
        </div>

        {/* Botão menu mobile alinhado à direita + saldo de tokens */}
        <div className="flex-1 flex justify-end items-center gap-2 md:hidden">
          {isLoggedIn && user && (
            <span className="px-2 py-1 rounded bg-slate-800/80 text-xs font-semibold text-yellow-200 border border-yellow-500 flex items-center gap-1 backdrop-blur-sm shadow-sm min-w-[40px] justify-center" title={t("nav.tokens", "Tokens disponíveis")}>
              {user.tokens ?? 0} <FontAwesomeIcon icon={faCoins} className="text-yellow-400 w-4 h-4" />
            </span>
          )}
          <button
            className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex flex-col md:hidden transition-colors duration-300 min-h-screen justify-center items-center" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm supports-[backdrop-filter]:bg-slate-900/90 transition-opacity cursor-pointer"
              aria-hidden="true"
              onClick={() => setMobileOpen(false)}
            ></div>

            <div
              className="relative z-10 flex flex-col w-[90vw] max-w-xs sm:max-w-sm bg-slate-800/95 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header fixo com botão de fechar */}
              <div className="flex items-center justify-end p-3 pb-0 sticky top-0 bg-slate-800/95 rounded-t-2xl z-20">
                <button
                  className="text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Fechar menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Conteúdo do menu com rolagem interna */}
              <div className="flex-1 overflow-y-auto w-full flex flex-col items-center px-5 sm:px-8 pt-2 pb-5 gap-5 sm:gap-8">
                {/* Avatar/usuário logado (ou login/register) */}
                {isLoggedIn && user ? (
                  <div className="flex flex-col items-center justify-center mb-2 sm:mb-4 gap-1">
                    <div className="flex items-center justify-center">
                      {avatar}
                      <span className="text-slate-300 text-base sm:text-lg ml-2">{t("nav.hello", "Olá")}, <span className="font-bold text-white">{user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user.email}</span></span>
                    </div>
                    <span className="mt-1 px-2 py-1 rounded bg-slate-800/80 text-xs font-semibold text-yellow-200 border border-yellow-500 flex items-center gap-1 backdrop-blur-sm shadow-sm min-w-[40px] justify-center" title={t("nav.tokens", "Tokens disponíveis")}>
                      {user.tokens ?? 0} <FontAwesomeIcon icon={faCoins} className="text-yellow-400 w-4 h-4" />
                    </span>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-medium text-slate-300 hover:text-white hover:bg-slate-700/40 rounded-xl transition-all duration-200 focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.login", "Conectar")}</Link>
                    <Link href="/register" className="block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition-all duration-200 focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.register", "Criar Conta")}</Link>
                  </>
                )}
                {/* Minha Conta (apenas logado) */}
                {isLoggedIn && (
                  <Link href="/account" className={
                    `block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-colors focus-visible:outline-none ` +
                    (activePath === "/account"
                      ? "text-blue-400 hover:text-blue-300 bg-slate-700/60"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/40")
                  } onClick={() => setMobileOpen(false)}>
                    {t("nav.account", "Minha Conta")}
                  </Link>
                )}
                {/* Como funciona */}
                <Link href="/how-it-works" className={
                  `block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-colors focus-visible:outline-none ` +
                  (activePath === "/how-it-works"
                    ? "text-blue-400 hover:text-blue-300 bg-slate-700/60"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/40")
                } onClick={() => setMobileOpen(false)}>
                  {t("nav.howItWorks", locale === 'pt' ? "Como funciona" : "How it works")}
                </Link>
                {/* Planos */}
                <Link href="/pricing" className={
                  `block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-colors focus-visible:outline-none ` +
                  (activePath === "/pricing"
                    ? "text-blue-400 hover:text-blue-300 bg-slate-700/60"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/40")
                } onClick={() => setMobileOpen(false)}>
                  {t("nav.pricing", locale === 'pt' ? "Planos" : "Pricing")}
                </Link>
                {/* Dashboard (apenas logado) */}
                {isLoggedIn && (
                  <Link href="/dashboard" className={
                    `block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-colors focus-visible:outline-none ` +
                    (activePath === "/dashboard"
                      ? "text-blue-400 hover:text-blue-300 bg-slate-700/60"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/40")
                  } onClick={() => setMobileOpen(false)}>
                    {t("nav.dashboard", "Dashboard")}
                  </Link>
                )}
                {/* Análise (apenas logado) */}
                {isLoggedIn && (
                  <Link href="/upload" className="block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition-all duration-200 focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.analysis", locale === 'pt' ? "Análise" : "Analyze")}</Link>
                )}
                {/* Idioma */}
                <button
                  onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}
                  className="block w-full text-center text-base sm:text-lg font-medium text-slate-400 hover:text-white transition-colors py-2"
                >
                  {t("nav.language", "Idioma")}: <span className="font-bold">{locale === 'pt' ? 'Português' : 'English'}</span>
                </button>
                {/* Sair (logout) por último */}
                {isLoggedIn && (
                  <button className="block w-full text-center py-3 sm:py-4 text-base sm:text-lg font-medium text-red-400 hover:text-red-300 hover:bg-slate-700/40 rounded-xl transition-all duration-200 focus-visible:outline-none mt-2" onClick={() => { logout(); setMobileOpen(false); }}>{t("nav.logout", "Sair")}</button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
