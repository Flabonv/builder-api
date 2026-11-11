import { createContext, useContext } from "react";
import type { User } from "../types/api";

export type AuthState =
  | { status: "checking" }
  | { status: "anonymous" }
  | { status: "authenticated"; token: string ; user: User}

export interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Shared by AuthProvider (writes it) and useAuth (reads it).
// Lives here, not in AuthContext.tsx, so that file only exports a component (Fast Refresh).
export const AuthContext = createContext<AuthContextValue | null>(null);

// The hook that components use
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
