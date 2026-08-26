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
  ArrowRight, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Truck 
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency, generateOrderNumber, generateWhatsAppOrderMessage, OFFICIAL_STORE_PHONE } from "@/lib/utils";
import { DataService } from "@/lib/data-service";
import { Order } from "@/types";

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Checkout form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Medellín");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const total = subtotal;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerCity.trim()) {
      setFormError("Por favor completa tu nombre, teléfono y ciudad.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const newOrder: Order = {
        id: "ord-" + Date.now(),
        orderNumber,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          city: customerCity.trim(),
          address: customerAddress.trim(),
          notes: customerNotes.trim(),
        },
        items: [...items],
        subtotal,
        total,
        status: "pendiente",
        channel: "whatsapp_web",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Save in database
      DataService.createOrder(newOrder);
      setLastOrder(newOrder);

      // 2. Confetti effect
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      // 3. Generate WhatsApp Link
      const waUrl = generateWhatsAppOrderMessage(newOrder, OFFICIAL_STORE_PHONE);

      // 4. Open WhatsApp in new tab
      window.open(waUrl, "_blank");

      // 5. Clear cart and set success step
      clearCart();
      setStep("success");
    } catch (error) {
      console.error("Error creating order:", error);
      setFormError("Ocurrió un error al procesar el pedido. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("cart");
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in-50 duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                {step === "cart" && `Tu Carrito (${items.length})`}
                {step === "checkout" && "Datos para tu Pedido"}
                {step === "success" && "¡Pedido Generado!"}
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            
            {/* STEP 1: CART ITEMS */}
            {step === "cart" && (
              <>
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-500">
                      <ShoppingCart className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                        Tu carrito está vacío
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Explora nuestro catálogo de herramientas y materiales de ferretería para comenzar.
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-md"
                    >
                      Explorar Catálogo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId || "default"}`}
                        className="flex gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-18 h-18 rounded-xl bg-white dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                          <Image
                            src={item.image || "/LogoMultiogar.png"}
                            alt={item.productName}
                            fill
                            className="object-contain p-1"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                                {item.productName}
                              </h4>
                              <button
                                onClick={() => removeItem(item.productId, item.variantId)}
                                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                title="Eliminar item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {item.variantName && (
                              <span className="inline-block mt-0.5 text-[11px] font-medium text-orange-600 dark:text-orange-400">
                                Opción: {item.variantName}
                              </span>
                            )}
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: {item.sku}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === "checkout" && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400">
                    {formError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez / Constructora XYZ"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Número de WhatsApp / Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 312 345 6789"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Ciudad / Municipio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Medellín, Bello..."
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Dirección (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Calle 10 # 43-12"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Notas o Instrucciones Especiales
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Requiero factura electrónica con NIT, enviar en horas de la tarde..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  />
                </div>

                {/* Info Callout */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Confirmación Inmediata por WhatsApp</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400">
                    Al presionar el botón se abrirá WhatsApp con el resumen de tu pedido. Un asesor de Multiogar te confirmará disponibilidad y método de pago (Transferencia Bancaria, Nequi, Daviplata o Pago contra entrega).
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isSubmitting ? "Generando..." : "Enviar a WhatsApp"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {step === "success" && lastOrder && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    N° Pedido: {lastOrder.orderNumber}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ¡Pedido enviado a WhatsApp con éxito!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Tu pedido ha sido registrado en nuestro sistema. El asesor de Multiogar Ferretería ya tiene tus datos y te responderá en el chat de WhatsApp.
                  </p>
                </div>

                <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cliente:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{lastOrder.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(lastOrder.total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            )}

          </div>

          {/* Drawer Footer (Subtotal & Actions for Step 1) */}
          {step === "cart" && items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Subtotal de productos:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-extrabold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Estimado:</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20" />
                  <span>Finalizar Pedido por WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Compra 100% Segura
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-500" /> Despachos Rápidos
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};