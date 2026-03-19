import { useAuth } from "@/contexts/AuthContext";

export function useUser() {
  const ctx = useAuth();
  return ctx?.user && ctx.isLoggedIn ? ctx.user : null;
}
