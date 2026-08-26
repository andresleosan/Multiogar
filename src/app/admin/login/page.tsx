"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Lock, Mail, ShieldCheck, ArrowRight, Store } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@multiogar.com");
  const [password, setPassword] = useState("multiogar2026");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent, selectedRole: "superadmin" | "vendedor" = "superadmin") => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("multiogar_admin_auth", "true");
      localStorage.setItem("multiogar_admin_role", selectedRole);
      router.push("/admin");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Glow decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-2">
            <BrandLogo size="lg" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-white">Panel de Administración</h1>
            <p className="text-xs text-slate-400">
              Acceso exclusivo para personal de Multiogar Ferretería
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={(e) => handleLogin(e, "superadmin")} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Correo Electrónico</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
          >
            <span>{loading ? "Accediendo..." : "Iniciar Sesión"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins for RBAC testing */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 block text-center uppercase tracking-wider">
            Accesos de Prueba Rápida (RBAC):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => handleLogin(e, "superadmin")}
              className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs transition-colors text-center"
            >
              👑 SuperAdmin
            </button>
            <button
              onClick={(e) => handleLogin(e, "vendedor")}
              className="py-2.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs transition-colors text-center"
            >
              👤 Vendedor
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