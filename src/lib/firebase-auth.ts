import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface AuthState {
  user: User | null;
  role: "superadmin" | "vendedor" | "cliente";
  email: string | null;
  isAuthenticated: boolean;
}

export function determineUserRole(email: string | null): "superadmin" | "vendedor" | "cliente" {
  if (!email) return "cliente";
  const normalized = email.toLowerCase().trim();
  if (normalized === "admin@admin.com" || normalized.includes("admin") || normalized.includes("superadmin")) {
    return "superadmin";
  }
  if (normalized.includes("vendedor") || normalized.includes("ventas")) {
    return "vendedor";
  }
  return "cliente";
}

export async function loginWithFirebase(email: string, pass: string): Promise<{ success: boolean; role: string; error?: string }> {
  try {
    const cleanEmail = email.trim();
    let userCredential;

    try {
      // 1. Try Signing In
      userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (signInErr: any) {
      // 2. If user does not exist yet in Firebase Console, auto-create to ensure smooth onboarding
      if (
        signInErr.code === "auth/user-not-found" || 
        signInErr.code === "auth/invalid-credential" ||
        signInErr.code === "auth/invalid-login-credentials"
      ) {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        } catch (createErr: any) {
          // If creation fails because it already exists with different pass, bubble up error
          throw signInErr;
        }
      } else {
        throw signInErr;
      }
    }

    const user = userCredential.user;
    const role = determineUserRole(user.email);

    // Save session in local storage for Next.js SSR & fast rendering
    if (typeof window !== "undefined") {
      localStorage.setItem("multiogar_admin_auth", "true");
      localStorage.setItem("multiogar_admin_role", role);
      localStorage.setItem("multiogar_user_email", user.email || cleanEmail);
    }

    return { success: true, role };
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    let message = "Error al autenticar con Firebase.";
    if (error.code === "auth/invalid-email") message = "El correo electrónico no es válido.";
    if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") message = "Contraseña incorrecta.";
    if (error.code === "auth/too-many-requests") message = "Demasiados intentos fallidos. Intenta más tarde.";
    if (error.code === "auth/weak-password") message = "La contraseña debe tener al menos 6 caracteres.";
    return { success: false, role: "cliente", error: message };
  }
}

export async function logoutFromFirebase(): Promise<void> {
  try {
    if (auth) {
      await signOut(auth);
    }
  } catch (e) {
    console.warn("Sign out warning:", e);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("multiogar_admin_auth");
      localStorage.removeItem("multiogar_admin_role");
      localStorage.removeItem("multiogar_user_email");
    }
  }
}