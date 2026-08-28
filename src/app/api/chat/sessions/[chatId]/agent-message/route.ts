import { FieldValue } from "@google-cloud/firestore";
import { NextRequest, NextResponse } from "next/server";
import { chatMessageTextSchema } from "@/lib/chat-contracts";
import { getAdminFirestore, getAdminStorageBucket } from "@/lib/firebase-admin";
import {
  getChatAttachmentPath,
  MAX_CHAT_ATTACHMENT_BYTES,
  MAX_CHAT_ATTACHMENT_OUTPUT_BYTES,
  normalizeChatAttachment,
  type ChatAttachmentUpload,
} from "@/lib/server/chat-attachments";
import { getStaffIdentity } from "@/lib/server/chat-auth";
import { ChatRequestError, handleChatServerError, jsonError } from "@/lib/server/chat-http";
import { consumeRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const AGENT_MESSAGE_RATE_LIMIT = { limit: 60, windowMs: 60_000, minIntervalMs: 250 };
const MAX_MULTIPART_REQUEST_BYTES = MAX_CHAT_ATTACHMENT_BYTES + 16_384;

interface RouteContext {
  params: Promise<{ chatId: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  let uploadedObject: { delete(): Promise<unknown> } | null = null;
  try {
    const { chatId } = await context.params;
    if (!/^chat_[a-f0-9]{40}$/.test(chatId)) {
      return jsonError("Conversación no encontrada.", 404);
    }

    const staff = await getStaffIdentity(request);
    if (!staff) return jsonError("Debes iniciar sesión.", 401);

    const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim();
    if (contentType !== "multipart/form-data") {
      return jsonError("La solicitud debe usar multipart/form-data.", 415);
    }
    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_MULTIPART_REQUEST_BYTES) {
      return jsonError("El adjunto supera el límite permitido de 5 MB.", 413);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("No fue posible leer el adjunto.", 400);
    }
    if (formData.getAll("file").length !== 1) {
      return jsonError("Selecciona una imagen para enviar.", 400);
    }
    const rawText = formData.get("text");
    if (rawText !== null && typeof rawText !== "string") {
      return jsonError("El texto del mensaje no es válido.", 400);
    }
    const parsedText = chatMessageTextSchema.safeParse(rawText ?? "");
    if (!parsedText.success) {
      return jsonError("El mensaje no puede superar 1200 caracteres.", 400);
    }
    const rawFile = formData.get("file");
    if (typeof File === "undefined" || !(rawFile instanceof File)) {
      return jsonError("El adjunto no es válido.", 400);
    }
    const upload: ChatAttachmentUpload = rawFile;

    const db = await getAdminFirestore();
    const rateLimit = await consumeRateLimit(
      db,
      `chat-agent-message:${staff.uid}`,
      AGENT_MESSAGE_RATE_LIMIT,
    );
    if (!rateLimit.allowed) {
      return jsonError("Has enviado varios mensajes seguidos. Espera un momento.", 429, rateLimit.retryAfterSeconds);
    }

    const chatReference = db.collection("chats").doc(chatId);
    const chatSnapshot = await chatReference.get();
    if (!chatSnapshot.exists || chatSnapshot.data()?.status === "cerrado") {
      return jsonError("La conversación no está disponible.", 409);
    }

    let normalizedAttachment: Buffer;
    try {
      normalizedAttachment = await normalizeChatAttachment(upload);
    } catch {
      return jsonError(
        `El adjunto debe ser una imagen JPG, PNG o WebP válida de hasta ${Math.floor(MAX_CHAT_ATTACHMENT_BYTES / (1024 * 1024))} MB y ${Math.floor(MAX_CHAT_ATTACHMENT_OUTPUT_BYTES / 1024)} KB procesada.`,
        415,
      );
    }

    const messageReference = chatReference.collection("messages").doc();
    const attachmentPath = getChatAttachmentPath(chatId, messageReference.id);
    const storageObject = getAdminStorageBucket().file(attachmentPath);
    uploadedObject = storageObject;
    try {
      await storageObject.save(normalizedAttachment, {
        resumable: false,
        metadata: { contentType: "image/jpeg", cacheControl: "private, max-age=0, no-store" },
      });
    } catch (error) {
      await storageObject.delete().catch(() => undefined);
      uploadedObject = null;
      throw error;
    }

    const now = new Date().toISOString();
    const message = {
      id: messageReference.id,
      chatId,
      sender: "agent" as const,
      senderName: staff.displayName,
      text: parsedText.data,
      attachmentUrl: `/api/chat/sessions/${chatId}/attachments/${messageReference.id}`,
      attachmentType: "image" as const,
      createdAt: now,
    };

    try {
      await db.runTransaction(async (transaction) => {
        const currentChat = await transaction.get(chatReference);
        if (!currentChat.exists || currentChat.data()?.status === "cerrado") {
          throw new ChatRequestError("La conversación está cerrada.", 409);
        }
        transaction.create(messageReference, { ...message, attachmentPath });
        transaction.update(chatReference, {
          lastMessage: message.text || "Imagen adjunta",
          lastMessageAt: now,
          unreadCustomer: FieldValue.increment(1),
          updatedAt: now,
        });
      });
    } catch (error) {
      await uploadedObject.delete().catch(() => undefined);
      uploadedObject = null;
      throw error;
    }

    uploadedObject = null;
    return NextResponse.json({ message }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error: unknown) {
    if (uploadedObject) await uploadedObject.delete().catch(() => undefined);
    return handleChatServerError(error);
  }
}
