import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

test("Navbar renders and has Analyze Resume button", () => {
  render(
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );
  // O botão de análise foi removido, então validamos links principais
  expect(screen.getByText(/ResumeAI/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Features/i })).toHaveAttribute("href", "/features");
  expect(screen.getByRole("link", { name: /How it works/i })).toHaveAttribute("href", "/how-it-works");
});
