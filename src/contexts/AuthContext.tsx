"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { User } from "@/types";

interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    let stopped = false;
    async function fetchUser() {
      if (typeof window === "undefined" || stopped) return;
      try {
        const res = await fetch("/api/auth/protected", { credentials: "include" });
        if (!res.ok) {
          setUser(null);
          setIsLoggedIn(false);
          stopped = true;
          if (interval) clearInterval(interval);
          return;
        }
        const data = await res.json();
        if (data.error) {
          setUser(null);
          setIsLoggedIn(false);
          stopped = true;
          if (interval) clearInterval(interval);
          return;
        }
        const userData = data.user || data;
        setUser({
          id: userData.userId || userData.id,
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt || "",
          subscriptionType: userData.subscriptionType || "FREE",
          tokens: typeof userData.tokens === "number" ? userData.tokens : 0
        });
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
        stopped = true;
        if (interval) clearInterval(interval);
      }
    }
    fetchUser();
    interval = setInterval(fetchUser, 3000);
    return () => { if (interval) clearInterval(interval); };
  }, []);

  function logout() {
    if (typeof window !== "undefined") {
      require("@/lib/user").logout();
      setUser(null);
      setIsLoggedIn(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
