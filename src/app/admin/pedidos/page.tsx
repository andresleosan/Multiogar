"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ShoppingBag, 
  Search, 
  Phone, 
  MessageCircle, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X,
  FileText,
  MapPin
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    setOrders(DataService.getOrders());
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    DataService.updateOrderStatus(orderId, newStatus);
    loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== "todos" && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Bandeja de Pedidos WhatsApp
          </h1>
          <p className="text-xs text-slate-500">
            Control de pedidos entrantes generados desde el carrito de la tienda.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por N° pedido, cliente o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto max-w-full">
          {["todos", "pendiente", "atendido", "completado", "cancelado"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                filterStatus === st
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">N° Pedido</th>
                <th className="p-4">Fecha & Hora</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Ciudad</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString("es-CO")} {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{ord.customer.name}</span>
                    <a
                      href={`https://wa.me/57${ord.customer.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3 h-3" /> {ord.customer.phone}
                    </a>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {ord.customer.city}
                  </td>
                  <td className="p-4 font-medium">
                    {ord.items.length} productos
                  </td>
                  <td className="p-4 font-extrabold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(ord.total)}
                  </td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold capitalize border-0 focus:ring-2 focus:ring-blue-600 cursor-pointer ${
                        ord.status === "completado"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "atendido"
                          ? "bg-blue-100 text-blue-800"
                          : ord.status === "cancelado"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="atendido">Atendido</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        title="Ver detalle del pedido"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://wa.me/57${ord.customer.phone}?text=${encodeURIComponent(`Hola ${ord.customer.name}, te escribimos de Multiogar Ferretería respecto a tu pedido ${ord.orderNumber}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                        title="Chatear por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">Detalle de Pedido</span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedOrder.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teléfono:</span>
                <a
                  href={`https://wa.me/57${selectedOrder.customer.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-bold hover:underline"
                >
                  {selectedOrder.customer.phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ciudad / Destino:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOrder.customer.city}</span>
              </div>
              {selectedOrder.customer.address && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Dirección:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedOrder.customer.address}</span>
                </div>
              )}
              {selectedOrder.customer.notes && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <span className="font-bold block mb-0.5">Notas del cliente:</span>
                  <p className="italic">{selectedOrder.customer.notes}</p>
                </div>
              )}
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 dark:text-slate-300">Productos del Pedido:</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white dark:bg-slate-800/40">
                    <div className="min-w-0 pr-2">
                      <h5 className="font-bold text-slate-900 dark:text-white truncate">{it.productName}</h5>
                      {it.variantName && (
                        <span className="text-[11px] text-orange-600 dark:text-orange-400 block font-semibold">
                          Opción: {it.variantName}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {it.quantity} x {formatCurrency(it.price)}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700 dark:text-slate-300">Total a Cobrar:</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(selectedOrder.total)}</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              {(() => {
                const cleanPhone = selectedOrder.customer.phone.replace(/\D/g, "");
                const waPhone = cleanPhone.startsWith("58")
                  ? cleanPhone
                  : cleanPhone.startsWith("0")
                  ? "58" + cleanPhone.slice(1)
                  : "58" + cleanPhone;
                return (
                  <a
                    href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hola ${selectedOrder.customer.name}, te confirmamos la recepción de tu pedido ${selectedOrder.orderNumber} en Multiogar Ferretería Venezuela.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contactar por WhatsApp</span>
                  </a>
                );
              })()}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}