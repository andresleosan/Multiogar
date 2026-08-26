"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { ChatMessage, ChatSession } from "@/types";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";

export const LiveChatWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAdminRoute = pathname.startsWith("/admin");

  // Load or create customer session
  useEffect(() => {
    if (isAdminRoute) return;

    const initialLoad = window.setTimeout(() => {
      const storedSessionId = localStorage.getItem("multiogar_chat_session_id");
      if (storedSessionId) {
        const allSessions = DataService.getChatSessions();
        const existing = allSessions.find((item) => item.id === storedSessionId);
        if (existing) {
          setSession(existing);
          setCustomerName(existing.customerName);
          setIsStarted(true);
          setMessages(DataService.getChatMessages(existing.id));
        }
      }
    }, 0);

    return () => clearTimeout(initialLoad);
  }, [isAdminRoute]);

  // Poll for messages in session
  useEffect(() => {
    if (!session || !isOpen) return;

    const interval = setInterval(() => {
      const msgs = DataService.getChatMessages(session.id);
      setMessages(msgs);
    }, 1500);

    return () => clearInterval(interval);
  }, [session, isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !inputText.trim()) return;

    const newSession = DataService.createChatSession(
      customerName.trim(),
      undefined,
      inputText.trim()
    );

    localStorage.setItem("multiogar_chat_session_id", newSession.id);
    setSession(newSession);
    setIsStarted(true);
    setInputText("");
    setMessages(DataService.getChatMessages(newSession.id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !session) return;

    DataService.sendChatMessage(session.id, {
      chatId: session.id,
      sender: "customer",
      senderName: session.customerName,
      text: inputText.trim(),
    });

    setInputText("");
    setMessages(DataService.getChatMessages(session.id));

    // Simulated automated greeting if first reply
    setTimeout(() => {
      if (session) {
        const currentMsgs = DataService.getChatMessages(session.id);
        const hasAgentReply = currentMsgs.some((m) => m.sender === "agent");
        if (!hasAgentReply) {
          DataService.sendChatMessage(session.id, {
            chatId: session.id,
            sender: "agent",
            senderName: "Asesor Multiogar",
            text: "¡Hola " + session.customerName + "! Un asesor técnico está revisando tu consulta y te responderá en breve. Si requieres cotización urgente también puedes escribirnos directamente a nuestro WhatsApp oficial.",
          });
          setMessages(DataService.getChatMessages(session.id));
        }
      }
    }, 1500);
  };

  const handleQuickTopic = (topic: string) => {
    setInputText(topic);
  };

  if (isAdminRoute) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:scale-108 transition-all duration-300 flex items-center gap-2.5 border-2 border-white/20"
          aria-label="Abrir chat en vivo"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-blue-600 rounded-full animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold text-xs pr-1">
            Chat en Vivo
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/10 border border-white/20 p-1 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/LogoMultiogar.png"
                  alt="Multiogar"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-700 rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Asesoría Multiogar</h3>
                <span className="text-[11px] text-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  En línea | Tiempo resp: ~2 min
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={`https://wa.me/${OFFICIAL_STORE_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-white transition-colors"
                title="Pasar a WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/60 text-xs">
            
            {!isStarted ? (
              /* Welcome & Name Input Form */
              <div className="h-full flex flex-col justify-between py-2 space-y-4">
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">
                      ¡Bienvenido a Multiogar Ferretería! 🛠️
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      ¿Necesitas saber si tenemos un repuesto, cotizar tubería o consultar sobre una herramienta? Dinos tu nombre y tu consulta para atenderte.
                    </p>
                  </div>

                  {/* Quick Topics */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Preguntas Frecuentes:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "¿Tienen servicio a domicilio hoy?",
                        "Cotizar lista de materiales",
                        "Consultar stock de herramienta",
                        "¿Manejan tubería sanitaria PVC?",
                      ].map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleQuickTopic(topic)}
                          className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 text-[10px] text-left transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form to Start */}
                <form onSubmit={handleStartChat} className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre o empresa"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Escribe tu mensaje..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Message Stream */
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "customer" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[9px] text-slate-400 mb-0.5 px-1 font-medium">
                      {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        msg.sender === "customer"
                          ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}

          </div>

          {/* Footer Input Bar (When chat is active) */}
          {isStarted && (
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe tu consulta..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-3.5 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
