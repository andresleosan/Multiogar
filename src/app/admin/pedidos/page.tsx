"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { 
  Search, 
  MessageCircle, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X,
  Globe,
  Printer,
  Truck,
  Phone,
  MapPin,
  WalletCards
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { Order } from "@/types";
import { formatCurrency, normalizeVenezuelanPhoneForWhatsApp } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterChannel, setFilterChannel] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(() => {
    setOrders(DataService.getOrders());
  }, []);

  useEffect(() => {
    return DataService.subscribeOrders(setOrders);
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    DataService.updateOrderStatus(orderId, newStatus);
    loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== "todos" && o.status !== filterStatus) return false;
    if (filterChannel !== "todos") {
      if (filterChannel === "web" && o.channel !== "web") return false;
      if (filterChannel === "whatsapp" && o.channel !== "whatsapp_web") return false;
    }
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

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pendiente":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
      case "atendido":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" /> En Preparación
          </span>
        );
      case "enviado":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/30">
            <Truck className="w-3 h-3" /> En Camino
          </span>
        );
      case "completado":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Entregado / Pagado
          </span>
        );
      case "cancelado":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestión de Pedidos (Web & WhatsApp)
          </h1>
          <p className="text-xs text-slate-500">
            Control integral de compras web y pedidos por WhatsApp en Venezuela.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Buscar por N° pedido, cliente o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          
          {/* Channel Filter (Web vs WhatsApp) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setFilterChannel("todos")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterChannel === "todos" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilterChannel("web")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterChannel === "web" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3 h-3" />
              Web ({orders.filter(o => o.channel === "web").length})
            </button>
            <button
              onClick={() => setFilterChannel("whatsapp")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                filterChannel === "whatsapp" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp ({orders.filter(o => o.channel !== "web").length})
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto">
            {["todos", "pendiente", "atendido", "completado", "cancelado"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${
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

      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">N° Orden & Canal</th>
                <th className="px-6 py-4">Cliente / Contacto</th>
                <th className="px-6 py-4">Ciudad</th>
                <th className="px-6 py-4">Artículos</th>
                <th className="px-6 py-4">Total (USD)</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Order Number & Channel */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block">
                          {order.orderNumber}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {order.channel === "web" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-[10px] border border-blue-200 dark:border-blue-800">
                              <Globe className="w-3 h-3" /> Web
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {order.customer.name}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {order.customer.phone}
                        </span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {order.customer.city}
                    </td>

                    {/* Items count */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} unds ({order.items.length} items)
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                      {formatCurrency(order.total)} USD
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Detalle</span>
                        </button>

                        <a
                          href={`https://wa.me/${normalizeVenezuelanPhoneForWhatsApp(order.customer.phone)}?text=${encodeURIComponent(`Hola ${order.customer.name}, te contactamos de Multiogar Ferretería con respecto a tu pedido #${order.orderNumber}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                          title="Contactar al cliente por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron pedidos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    Pedido #{selectedOrder.orderNumber}
                  </h3>
                  {selectedOrder.channel === "web" ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                      Web Checkout
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      WhatsApp
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  Fecha de Registro: {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Customer Info & Status Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Datos del Cliente:
                  </span>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedOrder.customer.name}</p>
                    <p className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300">
                      <Phone className="h-3.5 w-3.5" />
                      {selectedOrder.customer.phone}
                    </p>
                    <p className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{selectedOrder.customer.city} {selectedOrder.customer.address ? `- ${selectedOrder.customer.address}` : ""}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <WalletCards className="h-3.5 w-3.5" />
                      Forma de pago: {selectedOrder.paymentMethod === "cashea" ? "Cashea" : "Por coordinar"}
                    </p>
                    {selectedOrder.customer.notes && (
                      <p className="pt-2 text-slate-500 italic border-t border-slate-200 dark:border-slate-700">
                        &quot;{selectedOrder.customer.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Cambiar Estado del Pedido:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "pendiente")}
                      className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center ${
                        selectedOrder.status === "pendiente"
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Pendiente
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "atendido")}
                      className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center ${
                        selectedOrder.status === "atendido"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      En Preparación
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "completado")}
                      className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center ${
                        selectedOrder.status === "completado"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Completado
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "cancelado")}
                      className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center ${
                        selectedOrder.status === "cancelado"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      Cancelado
                    </button>
                  </div>
                </div>

              </div>

              {/* Items Ordered Table */}
              <div className="space-y-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider block">
                  Artículos del Pedido:
                </span>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-850">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 p-1">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                          <p className="text-slate-500 font-mono text-[11px]">
                            SKU: {item.sku} {item.variantName ? `• ${item.variantName}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold block text-slate-900 dark:text-white">
                          {item.quantity} x {formatCurrency(item.price)}
                        </span>
                        <span className="font-black text-blue-600 dark:text-blue-400">
                          {formatCurrency(item.price * item.quantity)} USD
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total & Notes */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                <span>Total a Cobrar:</span>
                <span className="text-base">{formatCurrency(selectedOrder.total)} USD</span>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprobante</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
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
