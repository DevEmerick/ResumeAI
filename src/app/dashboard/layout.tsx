import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | ResumeAI",
  description: "Gerencie seus currículos, visualize análises recentes e acompanhe o leaderboard global.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}