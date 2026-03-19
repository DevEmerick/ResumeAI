export function isLoggedIn(): boolean {
  // Verifica se o token JWT está presente nos cookies
  if (typeof document === "undefined") return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('token='));
}
