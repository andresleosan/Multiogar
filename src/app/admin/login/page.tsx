"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Lock, Mail, ShieldCheck, ArrowRight, Store, AlertCircle, CheckCircle2, User, UserCheck } from "lucide-react";
import { loginWithFirebase } from "@/lib/firebase-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("qwertyui9*");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    try {
      const res = await loginWithFirebase(loginEmail, loginPass);
      if (res.success) {
        if (res.role === "cliente") {
          setSuccessMessage("¡Autenticado con éxito como CLIENTE! Redirigiendo a la tienda...");
          setTimeout(() => {
            router.push("/catalogo");
          }, 600);
        } else {
          setSuccessMessage(`¡Autenticado con éxito como ${res.role.toUpperCase()}! Redirigiendo al panel...`);
          setTimeout(() => {
            router.push("/admin");
          }, 600);
        }
      } else {
        setError(res.error || "Credenciales inválidas.");
      }
    } catch (err: any) {
      setError("Error al conectar con Firebase Auth.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    handleLogin(undefined, testEmail, testPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Glow decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-7 sm:p-8 space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-2">
            <BrandLogo size="lg" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-white">Acceso a Usuarios & Personal</h1>
            <p className="text-xs text-slate-400">
              Conectado a Firebase: <span className="font-mono text-blue-400">multiogarweb</span>
            </p>
          </div>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Correo Electrónico (Firebase Auth)</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@multiogar.com"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
          >
            <span>{loading ? "Verificando con Firebase..." : "Iniciar Sesión"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins for the 3 roles */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 block text-center uppercase tracking-wider">
            Accesos de Prueba Rápida (Firebase RBAC):
          </span>
          <div className="grid grid-cols-3 gap-2">
            
            {/* 1. SuperAdmin */}
            <button
              onClick={() => handleQuickFill("admin@admin.com", "qwertyui9*")}
              disabled={loading}
              className="py-2.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[11px] transition-all flex flex-col items-center gap-0.5 text-center"
            >
              <ShieldCheck className="w-4 h-4 mb-0.5" />
              <span>SuperAdmin</span>
              <span className="text-[9px] opacity-70 font-mono">admin@</span>
            </button>

            {/* 2. Vendedor */}
            <button
              onClick={() => handleQuickFill("vendedor@vendedor.com", "qwertyui9*")}
              disabled={loading}
              className="py-2.5 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-[11px] transition-all flex flex-col items-center gap-0.5 text-center"
            >
              <UserCheck className="w-4 h-4 mb-0.5" />
              <span>Vendedor</span>
              <span className="text-[9px] opacity-70 font-mono">vendedor@</span>
            </button>

            {/* 3. Cliente */}
            <button
              onClick={() => handleQuickFill("cliente@cliente.com", "qwertyui9*")}
              disabled={loading}
              className="py-2.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] transition-all flex flex-col items-center gap-0.5 text-center"
            >
              <User className="w-4 h-4 mb-0.5" />
              <span>Cliente</span>
              <span className="text-[9px] opacity-70 font-mono">cliente@</span>
            </button>

          </div>
        </div>

        {/* Back link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Volver a la Tienda Pública</span>
          </Link>
        </div>

      </div>
    </div>
  );
}