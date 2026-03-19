export function getUser(): { email: string, name: string } | null {
  if (typeof window === "undefined") return null;
  const token = document.cookie.split(';').find(c => c.trim().startsWith('token='));
  if (!token) return null;
  try {
    const jwtToken = token.split('=')[1];
    // Decodifica apenas o payload, sem validar assinatura (frontend)
    const payload = JSON.parse(window.atob(jwtToken.split('.')[1]));
    return { email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export async function logout() {
  if (typeof window !== "undefined") {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
}
