"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/I18nContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { locale, setLocale, t } = useTranslation();

  // Avatar simples (iniciais)
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
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-500 hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">ResumeAI</Link>

        {/* Links desktop */}
        <div className="hidden md:flex gap-8">
          <Link href="/features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{t("nav.features", "Features")}</Link>
          <Link href="/how-it-works" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{t("nav.howItWorks", "How it works")}</Link>
          <Link href="/pricing" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{t("nav.pricing", "Pricing")}</Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{t("nav.dashboard", "Dashboard")}</Link>
          )}
        </div>

        {/* Ações desktop */}
        <div className="hidden md:flex items-center gap-2">
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
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-w-[120px] cursor-pointer"
                  onClick={() => setDropdownOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  aria-label="Abrir menu do usuário"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  {avatar}
                  <span className="text-sm whitespace-nowrap">{t("nav.hello", "Olá")}, <span className="font-bold text-white">{user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user.email}</span></span>
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

        {/* Botão menu mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 flex flex-col items-center justify-center md:hidden transition-colors duration-300" role="dialog" aria-modal="true">
            <button
              className="absolute top-6 right-6 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Fechar menu"
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col gap-8 items-center w-full mt-8">
              <button
                onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}
                className="block w-full text-center text-lg font-medium text-slate-400 hover:text-white transition-colors"
              >
                {t("nav.language", "Idioma")}: <span className="font-bold">{locale === 'pt' ? 'Português' : 'English'}</span>
              </button>
              <Link href="/features" className="block w-full text-center py-4 text-lg font-semibold text-slate-300 hover:text-white transition-colors focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.features", "Features")}</Link>
              <Link href="/how-it-works" className="block w-full text-center py-4 text-lg font-semibold text-slate-300 hover:text-white transition-colors focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.howItWorks", "How it works")}</Link>
              <Link href="/pricing" className="block w-full text-center py-4 text-lg font-semibold text-slate-300 hover:text-white transition-colors focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.pricing", "Pricing")}</Link>
              {!isLoggedIn ? (
                <>
                  <Link href="/login" className="block w-full text-center py-4 text-lg font-medium text-slate-300 hover:text-white transition-all duration-200 focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.login", "Conectar")}</Link>
                  <Link href="/register" className="block mx-4 text-center py-4 text-lg font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-all duration-200 focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.register", "Criar Conta")}</Link>
                </>
              ) : (
                <>
                  {user && (
                    <div className="flex items-center justify-center mb-4">
                      {avatar}
                      <span className="text-slate-300 text-lg">{t("nav.hello", "Olá")}, <span className="font-bold text-white">{user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user.email}</span></span>
                    </div>
                  )}
                  <button className="block w-full text-center py-4 text-lg font-medium text-red-400 hover:text-red-300 transition-all duration-200 focus-visible:outline-none mb-4" onClick={() => { logout(); setMobileOpen(false); }}>{t("nav.logout", "Sair")}</button>
                </>
              )}
              <Link href="/upload" className="block mx-4 text-center py-4 text-lg font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-all duration-200 focus-visible:outline-none" onClick={() => setMobileOpen(false)}>Analyze</Link>
              {isLoggedIn && (
                <>
                  <Link href="/dashboard" className="block w-full text-center py-4 text-lg font-medium text-slate-300 hover:text-white transition-colors focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.dashboard", "Dashboard")}</Link>
                  <Link href="/account" className="block w-full text-center py-4 text-lg font-medium text-slate-300 hover:text-white transition-colors focus-visible:outline-none" onClick={() => setMobileOpen(false)}>{t("nav.account", "Minha Conta")}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
