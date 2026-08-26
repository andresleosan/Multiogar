"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Search, 
  User, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MessageCircle,
  MoreVertical,
  CheckCheck
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { ChatMessage, ChatSession } from "@/types";

const QUICK_REPLIES = [
  "¡Hola! Con gusto te colaboro con la cotización de materiales.",
  "Tenemos stock disponible para entrega inmediata hoy.",
  "El despacho a tu dirección toma entre 24 y 48 horas.",
  "Para facturación electrónica por favor compártenos el RUT / NIT.",
];

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(() => {
      loadSessions();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = () => {
    const list = DataService.getChatSessions();
    setSessions(list);
    if (!selectedSessionId && list.length > 0) {
      setSelectedSessionId(list[0].id);
      setMessages(DataService.getChatMessages(list[0].id));
    }
  };

  useEffect(() => {
    if (selectedSessionId) {
      setMessages(DataService.getChatMessages(selectedSessionId));
    }
  }, [selectedSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeSession = sessions.find((s) => s.id === selectedSessionId);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || replyText).trim();
    if (!textToSend || !selectedSessionId) return;

    DataService.sendChatMessage(selectedSessionId, {
      chatId: selectedSessionId,
      sender: "agent",
      senderName: "Asesor Multiogar",
      text: textToSend,
    });

    setReplyText("");
    setMessages(DataService.getChatMessages(selectedSessionId));
    loadSessions();
  };

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.customerName.toLowerCase().includes(q) || s.lastMessage.toLowerCase().includes(q);
  });

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT PANE: CONVERSATION LIST (WHATSAPP WEB STYLE) */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
        
        {/* Search Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Bandeja de Entrada ({sessions.length})</span>
            </h2>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente o mensaje..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredSessions.map((s) => {
            const isSelected = s.id === selectedSessionId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSessionId(s.id)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/50 border-r-4 border-blue-600"
                    : "hover:bg-slate-100/80 dark:hover:bg-slate-800/50"
                }`}
              >
                {/* Avatar */}
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  {s.customerName.slice(0, 2).toUpperCase()}
                  {s.status === "abierto" && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {s.customerName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(s.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                    {s.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-1.5 pt-0.5">
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                      s.status === "abierto"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {s.status}
                    </span>

                    {s.unreadAdmin > 0 && (
                      <span className="w-4 h-4 rounded-full bg-orange-600 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                        {s.unreadAdmin}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* RIGHT PANE: ACTIVE CHAT CONVERSATION */}
      {activeSession ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
          
          {/* Active Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {activeSession.customerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  {activeSession.customerName}
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Chat en vivo activo desde la web
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSession.customerPhone && (() => {
                const clean = activeSession.customerPhone.replace(/\D/g, "");
                const wa = clean.startsWith("58") ? clean : clean.startsWith("0") ? "58" + clean.slice(1) : "58" + clean;
                return (
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Pasar a WhatsApp</span>
                  </a>
                );
              })()}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/50 dark:bg-slate-950/60">
            {messages.map((msg) => {
              const isAgent = msg.sender === "agent";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                    {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed shadow-xs ${
                      isAgent
                        ? "bg-blue-600 text-white rounded-br-xs"
                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Bar */}
          <div className="p-2 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-bold px-1 whitespace-nowrap">Plantillas:</span>
            {QUICK_REPLIES.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(undefined, qr)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 whitespace-nowrap transition-colors"
              >
                {qr.slice(0, 32)}...
              </button>
            ))}
          </div>

          {/* Bottom Send Form */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu respuesta al cliente..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-5 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
          <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Selecciona una conversación</h3>
          <p className="text-xs max-w-xs mt-1">
            Los mensajes enviados por los clientes en el widget de la tienda aparecerán aquí en tiempo real.
          </p>
        </div>
      )}

    </div>
  );
}