"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Lock, Mail } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { loginWithFirebase } from "@/lib/firebase-auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const result = await loginWithFirebase(email, password);
    if (!result.success || !result.role) {
      setError(result.error || "Credenciales inválidas.");
      setLoading(false);
      return;
    }

    if (result.role === "cliente") {
      setSuccessMessage("Sesión iniciada. Abriendo el catálogo...");
      window.location.replace("/catalogo");
      return;
    }

    setSuccessMessage("Sesión iniciada. Abriendo el panel...");
    window.location.replace("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <main className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <BrandLogo size="lg" />
        <div className="mt-7">
          <p className="text-xs font-extrabold uppercase text-orange-600">Acceso seguro</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Ingresar a Multiogar</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            El personal accede al panel. Las cuentas de cliente regresan al catálogo.
          </p>
        </div>

        {error && (
          <div role="alert" className="mt-5 flex gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-5 flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
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
            disabled={loading}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>
      </main>
    </div>
  );
}
