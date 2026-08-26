"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Phone
} from "lucide-react";
import { DataService, type DashboardMetrics } from "@/lib/data-service";
import { Order, Product } from "@/types";
import { formatCurrency, normalizeVenezuelanPhoneForWhatsApp } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  const loadData = useCallback(() => {
    const nextStats = DataService.getDashboardStats();
    setStats(nextStats);
    setRecentOrders(DataService.getOrders().slice(0, 5));
    setLowStockProducts(
      DataService.getProducts().filter((product) => product.stock <= 15).slice(0, 4),
    );
  }, []);

  useEffect(() => {
    const unsubscribeProducts = DataService.subscribeProducts(loadData);
    const unsubscribeOrders = DataService.subscribeOrders(loadData);
    const unsubscribeChats = DataService.subscribeChatSessions(loadData);

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeChats();
    };
  }, [loadData]);

  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    DataService.updateOrderStatus(orderId, status);
    const orders = DataService.getOrders();
    setRecentOrders(orders.slice(0, 5));
    setStats(DataService.getDashboardStats());
  };

  if (!stats) return <div className="p-8 text-center text-slate-500">Cargando métricas...</div>;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col items-center justify-between gap-6 rounded-md border border-slate-200 border-l-4 border-l-blue-700 bg-white p-6 text-slate-950 shadow-sm dark:border-slate-800 dark:border-l-blue-500 dark:bg-slate-900 dark:text-white md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-xl sm:text-2xl font-black">
            Panel de operaciones Multiogar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resumen del inventario y de los registros disponibles en Firestore.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos"
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Gestionar Catálogo</span>
          </Link>
          <Link
            href="/admin/chats"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Revisar conversaciones</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pedidos</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">{stats.totalOrders}</span>
            <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
              {stats.pendingOrders} pendientes de atención
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ventas Estimadas</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">
              {formatCurrency(stats.totalSales)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">
              {stats.completedOrders} pedidos completados
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Productos Activos</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">{stats.totalActiveProducts}</span>
            <span className="text-[11px] font-semibold text-amber-500">
              {stats.lowStockProducts} con stock bajo
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversaciones</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">{stats.openChats}</span>
            <span className="text-[11px] font-semibold text-blue-500">
              Conversaciones activas
            </span>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sales by Category Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Ventas por Categoría de Producto
              </h3>
              <p className="text-[11px] text-slate-400">Distribución de ingresos según pedidos registrados</p>
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-72 w-full pt-4">
            {stats.categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categorySales}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: unknown) => [formatCurrency(Number(value)), "Ventas"]}
                    contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                  />
                  <Bar dataKey="value" fill="#1F47FE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-slate-200 px-6 text-center dark:border-slate-700">
                <ShoppingBag className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Sin pedidos registrados</p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">La distribución por categoría aparecerá cuando existan pedidos reales.</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Alertas de Stock Bajo
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">Productos que requieren reposición urgente</p>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-4">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</h4>
                    <span className="text-[10px] text-slate-400">SKU: {p.sku}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-black text-[11px] bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                    {p.stock} unid.
                  </span>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-500">No hay productos con stock bajo.</p>
              )}
            </div>
          </div>

          <Link
            href="/admin/productos"
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs text-center transition-colors block"
          >
            Abrir inventario &rarr;
          </Link>
        </div>

      </div>

      {/* Recent WhatsApp Orders Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Últimos pedidos registrados
            </h3>
            <p className="text-[11px] text-slate-400">Control de estado y seguimiento de despachos</p>
          </div>
          <Link
            href="/admin/pedidos"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver todos los pedidos &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="p-3 rounded-l-xl">N° Pedido</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Ciudad / Dirección</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Estado</th>
                <th className="p-3 rounded-r-xl text-right">Acción Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{ord.customer.name}</span>
                    <a
                      href={`https://wa.me/${normalizeVenezuelanPhoneForWhatsApp(ord.customer.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {ord.customer.phone}
                    </a>
                  </td>
                  <td className="p-3 text-slate-500">
                    <span>{ord.customer.city}</span>
                    {ord.customer.address && <span className="block text-[10px] text-slate-400">{ord.customer.address}</span>}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                    {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                  </td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(ord.total)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                      ord.status === "completado"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        : ord.status === "atendido"
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                        : "bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300"
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {ord.status === "pendiente" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "atendido")}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px]"
                        >
                          Marcar Atendido
                        </button>
                      )}
                      {ord.status === "atendido" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, "completado")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                        >
                          Completar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-500">
                    No hay pedidos registrados en Firestore.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
