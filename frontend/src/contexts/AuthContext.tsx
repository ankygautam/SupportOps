import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearStoredToken, getMe, getStoredToken, login, storeToken } from "@/api";
import { mapUser } from "@/api/mappers";
import type { ApiRole, User } from "@/types/models";

interface SignInPayload {
  email: string;
  password: string;
  remember: boolean;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: SignInPayload) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => void;
  hasRole: (...roles: ApiRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    let active = true;

    getMe()
      .then((profile) => {
        if (!active) {
          return;
        }

        setUser(mapUser(profile));
      })
      .catch(() => {
        if (!active) {
          return;
        }

        clearStoredToken();
        setUser(null);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      clearStoredToken();
      setUser(null);
      setIsLoading(false);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("supportops:auth-feedback", "Your session expired. Sign in again to continue.");
      }
    }

    window.addEventListener("supportops:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("supportops:unauthorized", handleUnauthorized);
  }, []);

  async function signIn({ email, password, remember }: SignInPayload) {
    try {
      const response = await login(email.trim(), password);
      storeToken(response.token, remember);
      setUser(mapUser(response.user));
      setIsLoading(false);
      return { ok: true as const };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      clearStoredToken();
      setUser(null);
      setIsLoading(false);
      return { ok: false as const, error: message };
    }
  }

  function signOut() {
    clearStoredToken();
    setUser(null);
    setIsLoading(false);
  }

  const hasRole = useCallback((...roles: ApiRole[]) => {
    if (!user?.roleKey) {
      return false;
    }

    return roles.includes(user.roleKey);
  }, [user?.roleKey]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
      hasRole,
    }),
    [hasRole, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
