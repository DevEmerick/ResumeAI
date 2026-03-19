import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI | Análise de Currículos com IA",
  description: "Obtenha feedback instantâneo e otimize seu currículo usando Inteligência Artificial. Aumente suas chances de contratação com o ResumeAI.",
  openGraph: {
    title: "ResumeAI | Análise de Currículos com IA",
    description: "Obtenha feedback instantâneo e otimize seu currículo usando Inteligência Artificial.",
    type: "website",
    locale: "pt_BR",
    siteName: "ResumeAI",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col ${inter.className}`}>
        <I18nProvider>
          <AuthProvider>
            <AnalysisProvider>
              <main className="flex-1 flex flex-col w-full">
                {children}
              </main>
              <Footer />
            </AnalysisProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
