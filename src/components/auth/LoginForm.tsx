"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { getPostLoginRedirect, type AppRole } from "@/lib/auth-roles";
import { loginWithFirebase, loginWithGoogle } from "@/lib/firebase-auth";

interface LoginFormProps {
  requestedPath?: string;
}

export function LoginForm({ requestedPath }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingMethod, setLoadingMethod] = useState<"google" | "email" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const completeLogin = (role: AppRole) => {
    const destination = getPostLoginRedirect(requestedPath, role);
    setSuccessMessage(
      destination.startsWith("/admin")
        ? "Sesión iniciada. Abriendo el panel..."
        : "Sesión iniciada. Regresando a la tienda...",
    );
    window.location.replace(destination);
  };

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoadingMethod("email");

    const result = await loginWithFirebase(email, password);
    if (!result.success || !result.role) {
      setError(result.error || "No fue posible iniciar sesión.");
      setLoadingMethod(null);
      return;
    }
    completeLogin(result.role);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccessMessage("");
    setLoadingMethod("google");

    const result = await loginWithGoogle();
    if (!result.success || !result.role) {
      setError(result.error || "No fue posible iniciar sesión con Google.");
      setLoadingMethod(null);
      return;
    }
    completeLogin(result.role);
  };

  const isLoading = loadingMethod !== null;

  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <BrandLogo size="lg" />
        <div className="mt-7">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Iniciar sesión</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Accede a tu cuenta de Multiogar. El personal autorizado verá también su panel de trabajo.
          </p>
        </div>

        {error && (
          <div role="alert" className="mt-5 flex gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div role="status" className="mt-5 flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleGoogleLogin()}
          disabled={isLoading}
          className="mt-6 flex min-h-11 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
        >
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-sm border border-slate-300 font-black text-blue-700">G</span>
          {loadingMethod === "google" ? "Conectando con Google..." : "Continuar con Google"}
        </button>

        <div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          o usa tu correo
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <label className="block space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            Correo electrónico
            <span className="relative block">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm font-normal text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </span>
          </label>

          <label className="block space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            Contraseña
            <span className="relative block">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm font-normal text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
          >
            {loadingMethod === "email" ? "Verificando..." : "Iniciar sesión"}
            {loadingMethod !== "email" && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>
      </section>
    </div>
  );
}
