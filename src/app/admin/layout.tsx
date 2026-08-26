"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  UserCheck, 
  Store, 
  ExternalLink,
  Bell
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { DataService } from "@/lib/data-service";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"superadmin" | "vendedor">("superadmin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  // If on login page, don't show admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  useEffect(() => {
    const savedRole = localStorage.getItem("multiogar_admin_role") as "superadmin" | "vendedor";
    if (savedRole) setRole(savedRole);

    const checkBadges = () => {
      const chats = DataService.getChatSessions();
      const orders = DataService.getOrders();
      setUnreadChats(chats.filter((c) => c.status === "abierto" || c.unreadAdmin > 0).length);
      setPendingOrders(orders.filter((o) => o.status === "pendiente").length);
    };

    checkBadges();
    const interval = setInterval(checkBadges, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (newRole: "superadmin" | "vendedor") => {
    setRole(newRole);
    localStorage.setItem("multiogar_admin_role", newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("multiogar_admin_auth");
    router.push("/admin/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["superadmin", "vendedor"],
    },
    {
      name: "Inventario / Productos",
      href: "/admin/productos",
      icon: Package,
      roles: ["superadmin", "vendedor"],
    },
    {
      name: "Categorías",
      href: "/admin/categorias",
      icon: Layers,
      roles: ["superadmin"],
    },
    {
      name: "Pedidos WhatsApp",
      href: "/admin/pedidos",
      icon: ShoppingBag,
      badge: pendingOrders > 0 ? pendingOrders : undefined,
      badgeColor: "bg-orange-600",
      roles: ["superadmin", "vendedor"],
    },
    {
      name: "Bandeja de Chats",
      href: "/admin/chats",
      icon: MessageSquare,
      badge: unreadChats > 0 ? unreadChats : undefined,
      badgeColor: "bg-blue-600",
      roles: ["superadmin", "vendedor"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <BrandLogo size="sm" />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo */}
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <BrandLogo size="md" />
          </div>

          {/* Role Pill Switcher (Interactive RBAC Demo) */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400">Rol Activo:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                role === "superadmin" ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300"
              }`}>
                {role === "superadmin" ? "SuperAdmin" : "Vendedor"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleRoleChange("superadmin")}
                className={`py-1 rounded-lg transition-colors ${
                  role === "superadmin" ? "bg-amber-500 text-slate-950 font-extrabold shadow-xs" : "bg-slate-700/60 hover:bg-slate-700 text-slate-300"
                }`}
              >
                SuperAdmin
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("vendedor")}
                className={`py-1 rounded-lg transition-colors ${
                  role === "vendedor" ? "bg-blue-600 text-white font-extrabold shadow-xs" : "bg-slate-700/60 hover:bg-slate-700 text-slate-300"
                }`}
              >
                Vendedor
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {navItems
              .filter((item) => item.roles.includes(role))
              .map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                        : "hover:bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-slate-800 space-y-3 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Ver Tienda Pública</span>
            </div>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors font-semibold text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Desktop Admin Header */}
        <header className="hidden md:flex h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Panel de Control:</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white capitalize">
              {pathname === "/admin" && "Dashboard Principal"}
              {pathname === "/admin/productos" && "Inventario & Gestión de Productos"}
              {pathname === "/admin/categorias" && "Gestión de Categorías"}
              {pathname === "/admin/pedidos" && "Bandeja de Pedidos WhatsApp"}
              {pathname === "/admin/chats" && "Atención de Chats en Tiempo Real"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {role === "superadmin" ? "SA" : "VN"}
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {role === "superadmin" ? "Administrador Multiogar" : "Vendedor de Mostrador"}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">{role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}