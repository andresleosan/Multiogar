"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  subscribeToAuthState,
  UNAUTHENTICATED_STATE,
  type AuthState,
} from "@/lib/firebase-auth";

type AuthStatus = "loading" | "ready";
type AuthContextValue = AuthState & { status: AuthStatus };

const AuthContext = createContext<AuthContextValue | null>(null);

const initialState: AuthContextValue = {
  ...UNAUTHENTICATED_STATE,
  status: "loading",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthContextValue>(initialState);

  useEffect(() => {
    return subscribeToAuthState((nextState) => {
      setState({ ...nextState, status: "ready" });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  }
  return context;
}
