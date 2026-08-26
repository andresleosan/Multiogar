"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LoaderCircle,
  MessageSquare,
  Phone,
  Send,
  X,
} from "lucide-react";
import type { ChatMessage } from "@/types";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const PROFILE_KEY = "multiogar_chat_profile";

interface StoredProfile {
  name: string;
  phone?: string;
}

interface SessionResponse {
  session: {
    id: string;
    customerName: string;
    customerPhone: string | null;
  };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error || "No fue posible conectar con el chat.");
  }
  return body;
}

export function LiveChatWidget() {
  const pathname = usePathname();
  const { displayName } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const restoreAttemptedRef = useRef(false);
  const isHiddenRoute = pathname.startsWith("/admin") || pathname === "/login";

  useEffect(() => {
    if (isHiddenRoute) return;
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(PROFILE_KEY);
        const profile = stored ? (JSON.parse(stored) as StoredProfile) : null;
        setName((current) => current || profile?.name || displayName || "");
        setPhone((current) => current || profile?.phone || "");
      } catch {
        localStorage.removeItem(PROFILE_KEY);
        setName((current) => current || displayName || "");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [displayName, isHiddenRoute]);

  const loadMessages = async (chatId: string, signal?: AbortSignal) => {
    const response = await fetch(`/api/chat/sessions/${chatId}/messages`, {
      method: "GET",
      cache: "no-store",
      signal,
    });
    const body = await parseApiResponse<{ messages: ChatMessage[] }>(response);
    setMessages(body.messages);
  };

  const startSession = async (profile: StoredProfile): Promise<string> => {
    const response = await fetch("/api/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const body = await parseApiResponse<SessionResponse>(response);
    setSessionId(body.session.id);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return body.session.id;
  };

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const controller = new AbortController();
    const interval = window.setInterval(() => {
      void loadMessages(sessionId, controller.signal).catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "No fue posible actualizar el chat.");
      });
    }, 5_000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [isOpen, sessionId]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  const sendMessage = async (chatId: string, text: string) => {
    const response = await fetch(`/api/chat/sessions/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const body = await parseApiResponse<{ message: ChatMessage }>(response);
    setMessages((current) => [...current, body.message]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (sessionId || restoreAttemptedRef.current) return;

    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (!stored) return;
      const profile = JSON.parse(stored) as StoredProfile;
      if (!profile.name?.trim()) return;

      restoreAttemptedRef.current = true;
      setName(profile.name);
      setPhone(profile.phone || "");
      setIsStarting(true);
      setError("");
      void startSession(profile)
        .then((chatId) => loadMessages(chatId))
        .catch((requestError: unknown) => {
          setError(requestError instanceof Error ? requestError.message : "No fue posible recuperar el chat.");
        })
        .finally(() => setIsStarting(false));
    } catch {
      localStorage.removeItem(PROFILE_KEY);
    }
  };

  const handleStartChat = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    setError("");
    setIsStarting(true);
    try {
      const chatId = await startSession({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      await sendMessage(chatId, messageText.trim());
      setMessageText("");
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "No fue posible iniciar el chat.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sessionId || !messageText.trim() || isSending) return;

    setError("");
    setIsSending(true);
    try {
      await sendMessage(sessionId, messageText.trim());
      setMessageText("");
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "No fue posible enviar el mensaje.");
    } finally {
      setIsSending(false);
    }
  };

  if (isHiddenRoute) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="flex h-12 items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-bold text-white shadow-lg transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          aria-label="Abrir chat con Multiogar"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Chat Multiogar</span>
        </button>
      )}

      {isOpen && (
        <section
          aria-label="Chat con Multiogar"
          className="flex h-[min(540px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <header className="flex min-h-16 items-center justify-between bg-blue-800 px-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white p-1">
                <Image src="/LogoMultiogar.png" alt="" width={32} height={32} className="object-contain" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-extrabold">Atención Multiogar</h2>
                <p className="text-[11px] text-blue-100">Consulta productos y cotizaciones</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={`https://wa.me/${OFFICIAL_STORE_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-emerald-300 hover:bg-blue-700"
                title="Continuar por WhatsApp"
                aria-label="Continuar por WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-2 text-blue-100 hover:bg-blue-700 hover:text-white"
                aria-label="Cerrar chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 text-xs dark:bg-slate-950">
            {error && (
              <p role="alert" className="mb-3 rounded border border-rose-200 bg-rose-50 p-2.5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                {error}
              </p>
            )}

            {!sessionId ? (
              <form onSubmit={handleStartChat} className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">¿En qué podemos ayudarte?</h3>
                  <p className="mt-1 leading-5 text-slate-600 dark:text-slate-400">
                    Comparte tu consulta y un asesor podrá responder desde la bandeja de atención.
                  </p>
                </div>
                <label className="block space-y-1.5 font-bold text-slate-700 dark:text-slate-300">
                  Nombre
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-10 w-full rounded border border-slate-300 bg-white px-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </label>
                <label className="block space-y-1.5 font-bold text-slate-700 dark:text-slate-300">
                  Teléfono <span className="font-normal text-slate-400">(opcional)</span>
                  <input
                    type="tel"
                    maxLength={24}
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-10 w-full rounded border border-slate-300 bg-white px-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </label>
                <label className="block space-y-1.5 font-bold text-slate-700 dark:text-slate-300">
                  Consulta
                  <textarea
                    required
                    maxLength={1200}
                    rows={4}
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder="Producto, cantidad o información que necesitas"
                    className="w-full resize-none rounded border border-slate-300 bg-white p-3 font-normal text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isStarting}
                  className="flex min-h-10 w-full items-center justify-center gap-2 rounded bg-blue-700 px-4 font-bold text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
                >
                  {isStarting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isStarting ? "Conectando..." : "Enviar consulta"}
                </button>
              </form>
            ) : messages.length === 0 && isStarting ? (
              <div className="flex h-full items-center justify-center gap-2 text-slate-500">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Recuperando conversación...
              </div>
            ) : (
              <div className="space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-slate-500">Aún no hay mensajes en esta conversación.</p>
                )}
                {messages.map((message) => (
                  <div key={message.id} className={`flex flex-col ${message.sender === "customer" ? "items-end" : "items-start"}`}>
                    <span className="mb-1 px-1 text-[10px] text-slate-500">
                      {message.senderName} · {new Date(message.createdAt).toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <p className={`max-w-[85%] whitespace-pre-wrap break-words rounded-md px-3 py-2.5 leading-5 ${message.sender === "customer" ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"}`}>
                      {message.text}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {sessionId && (
            <form onSubmit={handleSendMessage} className="flex min-h-16 gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
              <input
                type="text"
                maxLength={1200}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Escribe tu mensaje"
                className="h-10 min-w-0 flex-1 rounded border border-slate-300 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={isSending || !messageText.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
                aria-label="Enviar mensaje"
              >
                {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}
