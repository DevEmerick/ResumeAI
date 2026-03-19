import { render, screen } from "@testing-library/react";
import UploadCard from "@/components/UploadCard";
import { AuthProvider } from "@/contexts/AuthContext";

test("UploadCard renders and has file input", () => {
  render(
    <AuthProvider>
      <UploadCard onAnalyze={jest.fn()} loading={false} />
    </AuthProvider>
  );
  // Corrige para aceitar múltiplos elementos e garantir que pelo menos um input de upload está presente
  const uploadInputs = screen.getAllByLabelText(/upload|selecionar arquivo/i);
  expect(uploadInputs.length).toBeGreaterThan(0);
});
