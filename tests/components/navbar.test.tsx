import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";

test("Navbar renders and has correct links", () => {
  render(
    <I18nProvider>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </I18nProvider>
  );
  // Valida links principais reais
  expect(screen.getByText(/ResumeAI/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /How it works/i })).toHaveAttribute("href", "/how-it-works");
  expect(screen.getByRole("link", { name: /Pricing/i })).toHaveAttribute("href", "/pricing");
  expect(screen.getByRole("link", { name: /Log in/i })).toHaveAttribute("href", "/login");
  expect(screen.getByRole("link", { name: /Sign up/i })).toHaveAttribute("href", "/register");
});
