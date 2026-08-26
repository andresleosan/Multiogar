import { z } from "zod";
import {
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { resolveRole, type AppRole } from "@/lib/auth-roles";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
});

const LEGACY_AUTH_KEYS = [
  "multiogar_admin_auth",
  "multiogar_admin_role",
  "multiogar_user_email",
] as const;

export interface AuthState {
  user: User | null;
  role: AppRole | null;
  email: string | null;
  isAuthenticated: boolean;
}

export interface LoginResult {
  success: boolean;
  role: AppRole | null;
  error?: string;
}

export const UNAUTHENTICATED_STATE: AuthState = {
  user: null,
  role: null,
  email: null,
  isAuthenticated: false,
};

export function clearLegacyAuthState(): void {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_AUTH_KEYS) {
    localStorage.removeItem(key);
  }
}

async function createAuthState(user: User | null): Promise<AuthState> {
  if (!user) return UNAUTHENTICATED_STATE;

  const token = await getIdTokenResult(user);
  return {
    user,
    role: resolveRole(user.email, token.claims),
    email: user.email,
    isAuthenticated: true,
  };
}

function getErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return null;
  }

  return typeof error.code === "string" ? error.code : null;
}

function getLoginErrorMessage(error: unknown): string {
  const code = getErrorCode(error);

  if (
    code === "auth/invalid-credential" ||
    code === "auth/invalid-login-credentials" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password"
  ) {
    return "Correo o contraseña incorrectos.";
  }
  if (code === "auth/too-many-requests") {
    return "Demasiados intentos fallidos. Intenta más tarde.";
  }
  if (code === "auth/network-request-failed") {
    return "No fue posible conectar con el servicio de autenticación.";
  }
  if (code === "auth/user-disabled") {
    return "Esta cuenta se encuentra deshabilitada.";
  }

  return "No fue posible iniciar sesión.";
}

export function subscribeToAuthState(
  callback: (state: AuthState) => void,
): Unsubscribe {
  clearLegacyAuthState();

  if (!auth) {
    callback(UNAUTHENTICATED_STATE);
    return () => undefined;
  }

  return onAuthStateChanged(auth, (user) => {
    void createAuthState(user)
      .then(callback)
      .catch(() => callback(UNAUTHENTICATED_STATE));
  });
}

export async function loginWithFirebase(
  email: string,
  password: string,
): Promise<LoginResult> {
  clearLegacyAuthState();

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      role: null,
      error: "Ingresa un correo válido y una contraseña de hasta 128 caracteres.",
    };
  }

  if (!auth) {
    return {
      success: false,
      role: null,
      error: "El servicio de autenticación no está configurado.",
    };
  }

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      parsed.data.email,
      parsed.data.password,
    );
    try {
      const state = await createAuthState(credential.user);
      return { success: true, role: state.role };
    } catch {
      await signOut(auth);
      return {
        success: false,
        role: null,
        error: "No fue posible validar los permisos de la cuenta.",
      };
    }
  } catch (error: unknown) {
    return { success: false, role: null, error: getLoginErrorMessage(error) };
  }
}

export async function logoutFromFirebase(): Promise<void> {
  clearLegacyAuthState();
  if (auth) {
    await signOut(auth);
  }
}
