import { render, screen } from "@testing-library/react";
import AnalysisResultCard from "@/components/AnalysisResultCard";

test("AnalysisResultCard renders analysis sections", () => {
  render(
    <AnalysisResultCard
      analysis={{
        score: 90,
        strengths: ["Clareza", "Formatação"],
        weaknesses: ["Pouca experiência"],
        suggestions: ["Adicionar resultados mensuráveis"]
      }}
      loading={false}
    />
  );
  expect(screen.getByText(/Score/i)).toBeInTheDocument();
  expect(screen.getByText(/Strengths/i)).toBeInTheDocument();
  expect(screen.getByText(/Weaknesses/i)).toBeInTheDocument();
  expect(screen.getByText(/Suggestions/i)).toBeInTheDocument();
});
