import { render, screen } from "@testing-library/react";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { I18nProvider } from "@/contexts/I18nContext";

test("AnalysisResultCard renders analysis sections", () => {
  render(
    <I18nProvider>
      <AnalysisResultCard
        analysis={{
          score: 90,
          strengths: ["Clareza", "Formatação"],
          weaknesses: ["Pouca experiência"],
          suggestions: ["Adicionar resultados mensuráveis"]
        }}
        loading={false}
      />
    </I18nProvider>
  );
  expect(screen.getByText(/Score/i)).toBeInTheDocument();
  expect(screen.getByText(/Strengths/i)).toBeInTheDocument();
  expect(screen.getByText(/Weaknesses/i)).toBeInTheDocument();
  expect(screen.getByText(/Suggestions/i)).toBeInTheDocument();
});
