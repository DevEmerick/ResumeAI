import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "@/app/dashboard/page";
import * as AuthContext from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";

// Mock do contexto de autenticação
jest.spyOn(AuthContext, "useAuth").mockReturnValue({
  user: { id: "user-1", name: "Test User", email: "test@example.com", createdAt: "2026-01-01" },
  isLoggedIn: true,
  logout: jest.fn(),
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        id: "1",
        userId: "user-1",
        fileName: "cv.pdf",
        content: "...",
        analysis: '{"score": 80}',
        createdAt: "2026-03-15T12:00:00Z",
      },
      {
        id: "2",
        userId: "user-1",
        fileName: "cv2.pdf",
        content: "...",
        analysis: '{"score": 90}',
        createdAt: "2026-03-14T12:00:00Z",
      },
    ]),
  })
) as jest.Mock;

describe("Dashboard integration", () => {
  it("exibe estatísticas e análises reais", async () => {
    render(
      <I18nProvider>
        <Dashboard />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument(); // resumesAnalyzed
      expect(screen.getByText("85")).toBeInTheDocument(); // averageScore
      // Verifica que a data aparece pelo menos duas vezes (estatística + tabela)
      expect(screen.getAllByText("3/15/2026").length).toBeGreaterThanOrEqual(2);
      // O nome do usuário aparece na navbar e na tabela (duas ou mais vezes)
      expect(screen.getAllByText("Test User").length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("80")).toBeInTheDocument();
      expect(screen.getByText("90")).toBeInTheDocument();
    });
  });

  it("mostra mensagem se não houver análises", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );
    render(
      <I18nProvider>
        <Dashboard />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("No analyses found.")).toBeInTheDocument();
    });
  });
});
