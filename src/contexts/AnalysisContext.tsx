"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";



export type AnalysisType = string | { result: string };

interface AnalysisContextProps {
  analysis: AnalysisType;
  setAnalysis: (a: AnalysisType) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  translations: Record<string, string>;
  setTranslations: (t: Record<string, string>) => void;
}


const AnalysisContext = createContext<AnalysisContextProps | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisType>("");
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis, loading, setLoading, translations, setTranslations }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
}
