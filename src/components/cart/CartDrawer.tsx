"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  MessageCircle,
  Copy,
  Check,
  WalletCards
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency, generateOrderId, generateOrderNumber, generateWhatsAppOrderMessage, OFFICIAL_STORE_PHONE } from "@/lib/utils";
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
  const [wantsCashea, setWantsCashea] = useState(true);
  const [formError, setFormError] = useState("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [lastOrderUrl, setLastOrderUrl] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setStep("checkout");
  };

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (customerName.trim().length < 2 || phoneDigits.length < 10 || phoneDigits.length > 15) {
      setFormError("Ingresa un nombre y un teléfono válido de 10 a 15 dígitos.");
      return;
    }
    setFormError("");

    const orderNumber = generateOrderNumber();

    const newOrder: Order = {
      id: generateOrderId(orderNumber),
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
      paymentMethod: wantsCashea ? "cashea" : "por_coordinar",
      status: "pendiente",
      channel: "whatsapp_web",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const waUrl = generateWhatsAppOrderMessage(newOrder, OFFICIAL_STORE_PHONE);
    setLastOrder(newOrder);
    setLastOrderUrl(waUrl);
    setStep("success");
  };

  const handleCopyOrderNumber = () => {
    if (lastOrder) {
      navigator.clipboard.writeText(lastOrder.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
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
                            Opción: {item.variantName}
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
                    Explora el catálogo, arma tu lista y confirma disponibilidad y despacho con ventas.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
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
                      <span>Despacho en Venezuela:</span>
                      <span className="text-emerald-600 font-bold">Entrega coordinada</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>Total:</span>
                      <span className="text-base text-slate-900 dark:text-white">{formatCurrency(subtotal)} USD</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98"
                  >
                    <span>Preparar pedido para WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: ORDER REQUEST FORM */}
          {step === "checkout" && (
            <form onSubmit={handleProcessOrder} className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Datos para tu Pedido
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    &larr; Volver al carrito
                  </button>
                </div>

                <div className="flex gap-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p>El pedido se enviará a ventas por WhatsApp para confirmar stock, precio final y despacho.</p>
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Forma de pago solicitada
                  </legend>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                    <input
                      type="checkbox"
                      checked={wantsCashea}
                      onChange={(event) => setWantsCashea(event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-blue-700"
                    />
                    <WalletCards className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />
                    <span>
                      <strong className="block text-xs text-slate-900 dark:text-white">Quiero pagar con Cashea</strong>
                      <span className="mt-1 block text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                        Pago inicial y cuotas quincenales sin intereses. Sujeto a aprobación, nivel y condiciones de Cashea.
                      </span>
                    </span>
                  </label>
                </fieldset>

                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Nombre Completo / Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Ej: Carlos Rodríguez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Customer Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={25}
                    placeholder="Ej: 0414-1234567 / 0424-9876543"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" /> Ciudad / Estado en Venezuela *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder="Ej: Caracas, Valencia, Maracay, Barquisimeto..."
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Dirección exacta de entrega (Opcional)
                  </label>
                  <input
                    type="text"
                    maxLength={180}
                    placeholder="Calle, sector, edificio o punto de referencia"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Notas adicionales
                  </label>
                  <textarea
                    rows={2}
                    maxLength={500}
                    placeholder="Detalles de facturación, horario preferido de entrega..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  />
                </div>

                <div className="flex gap-3 rounded-md border border-orange-200 bg-orange-50 p-3 text-xs text-orange-950 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-100">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>No realices pagos hasta que un asesor confirme los datos oficiales y la disponibilidad.</p>
                </div>

                {formError && (
                  <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {formError}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-4">
                <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white mb-2">
                  <span>Total Pedido:</span>
                  <span>{formatCurrency(subtotal)} USD</span>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 py-3.5 text-xs font-extrabold text-white transition-colors hover:bg-emerald-700 sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Revisar pedido antes de enviarlo</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: WHATSAPP HANDOFF */}
          {step === "success" && lastOrder && (
            <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto space-y-5 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9 animate-in zoom-in-75 duration-300" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Pedido listo para enviar
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <span>N° Orden: {lastOrder.orderNumber}</span>
                    <button 
                      onClick={handleCopyOrderNumber}
                      className="text-blue-600 hover:text-blue-700"
                      title="Copiar N° de Orden"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Abre WhatsApp y envía el mensaje. El pedido queda confirmado cuando ventas te responda.
                  </p>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Cliente:</span>
                    <span className="font-bold">{lastOrder.customer.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Teléfono:</span>
                    <span className="font-mono">{lastOrder.customer.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Destino:</span>
                    <span>{lastOrder.customer.city}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Forma de pago:</span>
                    <span className="font-bold">
                      {lastOrder.paymentMethod === "cashea" ? "Cashea" : "Por coordinar"}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Total estimado:</span>
                    <span>{formatCurrency(lastOrder.total)} USD</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-md bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-left text-xs space-y-1.5 text-orange-950 dark:text-orange-100">
                  <span className="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                    <ShieldCheck className="w-4 h-4" /> Antes de pagar
                  </span>
                  <p className="text-[11px]">Solicita los datos de pago oficiales durante la conversación. No se muestran cuentas bancarias en esta web.</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={lastOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={clearCart}
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir WhatsApp y enviar pedido</span>
                </a>

                <button
                  onClick={() => {
                    setStep("cart");
                    closeCart();
                  }}
                  className="w-full py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
