"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { getIdToken } from "firebase/auth";
import { 
  MessageSquare, 
  Paperclip,
  Send, 
  Phone, 
  Search
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { normalizeVenezuelanPhoneForWhatsApp } from "@/lib/utils";
import { ChatMessage, ChatSession } from "@/types";
import { ChatAttachment } from "@/components/chat/ChatAttachment";
import { useAuth } from "@/components/auth/AuthProvider";

const QUICK_REPLIES = [
  "¡Hola! Con gusto reviso tu cotización de materiales.",
  "Voy a validar el stock antes de confirmarte disponibilidad.",
  "Compárteme tu ciudad para consultar las opciones de despacho.",
  "Indícame las medidas, cantidades o marcas que necesitas.",
];

export default function AdminChatsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [sendError, setSendError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(() => {
    const list = DataService.getChatSessions();
    setSessions(list);
    setSelectedSessionId((current) => current ?? list[0]?.id ?? null);
  }, []);

  useEffect(() => {
    return DataService.subscribeChatSessions((list) => {
      setSessions(list);
      setSelectedSessionId((current) => current ?? list[0]?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    return DataService.subscribeChatMessages(selectedSessionId, setMessages);
  }, [selectedSessionId]);

  // Safe internal scroll — does NOT scroll the browser window or viewport
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const activeSession = sessions.find((s) => s.id === selectedSessionId);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || replyText).trim();
    const fileToSend = customText ? null : attachmentFile;
    if ((!textToSend && !fileToSend) || !selectedSessionId) return;

    setSendError("");
    try {
      if (fileToSend) {
        if (!user) throw new Error("La sesión administrativa expiró.");
        const token = await getIdToken(user, true);
        const formData = new FormData();
        formData.append("text", textToSend);
        formData.append("file", fileToSend);
        const response = await fetch(`/api/chat/sessions/${selectedSessionId}/agent-message`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const body = (await response.json().catch(() => ({}))) as { message?: ChatMessage; error?: string };
        if (!response.ok || !body.message) throw new Error(body.error || "No fue posible enviar el adjunto.");
        setMessages((current) => [...current, body.message as ChatMessage]);
        setAttachmentFile(null);
      } else {
        DataService.sendChatMessage(selectedSessionId, {
          chatId: selectedSessionId,
          sender: "agent",
          senderName: "Asesor Multiogar",
          text: textToSend,
        });
        setMessages(DataService.getChatMessages(selectedSessionId));
      }
      setReplyText("");
      loadSessions();
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "No fue posible enviar el mensaje.");
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.customerName.toLowerCase().includes(q) || s.lastMessage.toLowerCase().includes(q);
  });

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT PANE: CONVERSATION LIST (WHATSAPP WEB STYLE) */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 flex-shrink-0">
        
        {/* Search Header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Bandeja de Entrada ({sessions.length})</span>
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente o mensaje..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredSessions.map((session) => {
            const isSelected = session.id === selectedSessionId;
            return (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setMessages(DataService.getChatMessages(session.id));
                }}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                  isSelected
                    ? "bg-blue-50/80 dark:bg-blue-950/50 border-l-4 border-blue-600"
                    : "hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  {session.customerName.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {session.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {new Date(session.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {session.lastMessage}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      session.status === "abierto"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    }`}>
                      {session.status === "abierto" ? "Abierto" : "En Atención"}
                    </span>

                    {session.unreadAdmin > 0 && (
                      <span className="w-4 h-4 rounded-full bg-orange-600 text-white font-bold text-[9px] flex items-center justify-center ml-auto">
                        {session.unreadAdmin}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {filteredSessions.length === 0 && (
            <div className="px-6 py-12 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                {sessions.length === 0 ? "Sin conversaciones registradas" : "Sin coincidencias"}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {sessions.length === 0
                  ? "El chat público está desactivado hasta contar con un ingreso seguro."
                  : "Prueba con otro nombre o contenido del mensaje."}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANE: ACTIVE CHAT CONVERSATION */}
      {activeSession ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
          
          {/* Active Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850 flex-shrink-0">
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
                const wa = normalizeVenezuelanPhoneForWhatsApp(activeSession.customerPhone);
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

          {/* Messages Stream (Scoped internal scroll) */}
          <div 
            ref={chatContainerRef} 
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/50 dark:bg-slate-950/60"
          >
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
                    {msg.attachmentUrl && <ChatAttachment url={msg.attachmentUrl} user={user} />}
                    {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Replies Bar */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 overflow-x-auto flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 flex-shrink-0">
              Plantillas:
            </span>
            {QUICK_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(undefined, reply)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors"
              >
                {reply.slice(0, 30)}...
              </button>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Escribe tu respuesta al cliente..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-blue-500 dark:border-slate-700 dark:text-slate-300" title="Adjuntar imagen">
              <Paperclip className="h-4 w-4" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (file && (file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
                    setSendError("Selecciona una imagen JPG, PNG o WebP de hasta 5 MB.");
                    event.target.value = "";
                    return;
                  }
                  setSendError("");
                  setAttachmentFile(file);
                }}
              />
            </label>
            <button
              type="submit"
              disabled={!replyText.trim() && !attachmentFile}
              className="px-5 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
          {sendError && <p className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-[11px] text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{sendError}</p>}

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <MessageSquare className="w-12 h-12 mb-2 opacity-30" />
          <p className="font-bold text-sm">Selecciona una conversación para responder</p>
          <p className="max-w-sm text-xs">
            El chat público está desactivado hasta implementar identidad, validación y protección contra abuso.
          </p>
        </div>
      )}

    </div>
  );
}
