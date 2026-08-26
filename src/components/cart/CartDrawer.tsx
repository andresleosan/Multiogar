"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  User, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency, generateOrderNumber, generateWhatsAppOrderMessage, OFFICIAL_STORE_PHONE } from "@/lib/utils";
import { DataService } from "@/lib/data-service";
import { Order } from "@/types";

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems 
  } = useCartStore();

  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Caracas");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [lastOrderUrl, setLastOrderUrl] = useState("");
  const [lastOrderNumber, setLastOrderNumber] = useState("");

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setStep("checkout");
  };

  const handleSendOrderToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Por favor ingresa tu nombre y número de teléfono.");
      return;
    }

    const orderNumber = generateOrderNumber();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNumber,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        city: customerCity.trim() || "Venezuela",
        address: customerAddress.trim(),
        notes: customerNotes.trim(),
      },
      items: [...items],
      subtotal: subtotal,
      total: subtotal,
      status: "pendiente",
      channel: "whatsapp_web",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save in persistent DataService
    DataService.createOrder(newOrder);

    // Generate WhatsApp Link
    const waUrl = generateWhatsAppOrderMessage(newOrder, OFFICIAL_STORE_PHONE);
    setLastOrderUrl(waUrl);
    setLastOrderNumber(orderNumber);

    // Trigger celebratory confetti 🎉
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setStep("success");
    clearCart();

    // Open WhatsApp in new tab
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  Carrito de Compras
                </h3>
                <span className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? "artículo" : "artículos"} • Precios en USD
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: CART LIST VIEW */}
          {step === "cart" && (
            <>
              {items.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || "default"}`} className="pt-3 first:pt-0 flex gap-3.5">
                      
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200/80 dark:border-slate-700/60 p-1">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors flex-shrink-0"
                            title="Eliminar del carrito"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.variantName && (
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                            Variante: {item.variantName}
                          </span>
                        )}

                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                              className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                              disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                              className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Tu carrito está vacío
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Explora nuestros discos de corte Fortek, herramientas y materiales de ferretería con precios en USD.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Ver Catálogo
                  </button>
                </div>
              )}

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal estimado:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Despacho:</span>
                      <span className="text-emerald-600 font-bold">A coordinar por WhatsApp</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>Total:</span>
                      <span className="text-base text-slate-900 dark:text-white">{formatCurrency(subtotal)} USD</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                  >
                    <span>Finalizar Pedido por WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === "checkout" && (
            <form onSubmit={handleSendOrderToWhatsApp} className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Datos de Entrega en Venezuela
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    &larr; Volver al carrito
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Nombre Completo / Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Rodríguez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 0414-1234567 / 0424-9876543"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" /> Ciudad / Estado en Venezuela *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Caracas, Valencia, Maracay, Barquisimeto..."
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Dirección exacta de entrega (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Calle, sector, edificio o punto de referencia"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Método de pago / Notas
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Pago por Pago Móvil, Zelle o Efectivo USD al recibir..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  />
                </div>

                {/* Micro Guarantee */}
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Tu pedido será confirmado directamente por un asesor comercial en WhatsApp.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white mb-2">
                  <span>Total Pedido:</span>
                  <span>{formatCurrency(subtotal)} USD</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pedido por WhatsApp</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === "success" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 animate-in zoom-in-75 duration-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  ¡Pedido Enviado a WhatsApp!
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500">
                  N° de Pedido: {lastOrderNumber}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto pt-1">
                  Si tu WhatsApp no se abrió automáticamente, presiona el botón inferior para contactar al asesor:
                </p>
              </div>

              <a
                href={lastOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Abrir WhatsApp Ahora</span>
              </a>

              <button
                onClick={() => {
                  setStep("cart");
                  closeCart();
                }}
                className="text-xs text-slate-500 hover:underline"
              >
                Seguir navegando en la tienda
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};