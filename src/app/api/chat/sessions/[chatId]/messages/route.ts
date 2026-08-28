import { FieldValue } from "@google-cloud/firestore";
import { NextRequest, NextResponse } from "next/server";
import {
  chatMessageInputSchema,
  chatMessageTextSchema,
} from "@/lib/chat-contracts";
import { getAdminFirestore, getAdminStorageBucket } from "@/lib/firebase-admin";
import {
  getChatAttachmentPath,
  MAX_CHAT_ATTACHMENT_BYTES,
  MAX_CHAT_ATTACHMENT_OUTPUT_BYTES,
  normalizeChatAttachment,
  type ChatAttachmentUpload,
} from "@/lib/server/chat-attachments";
import { getChatVisitor } from "@/lib/server/chat-visitor";
import {
  ChatRequestError,
  handleChatServerError,
  jsonError,
  readJsonBody,
} from "@/lib/server/chat-http";
import { consumeRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const READ_RATE_LIMIT = { limit: 40, windowMs: 60_000, minIntervalMs: 1_000 };
const MESSAGE_RATE_LIMIT = { limit: 8, windowMs: 60_000, minIntervalMs: 1_000 };
const MAX_MULTIPART_REQUEST_BYTES = MAX_CHAT_ATTACHMENT_BYTES + 16_384;

interface RouteContext {
  params: Promise<{ chatId: string }>;
}

async function getChatRequestContext(request: NextRequest, chatId: string) {
  if (!/^chat_[a-f0-9]{40}$/.test(chatId)) return null;

  const visitor = getChatVisitor(request);
  if (!visitor) return null;

  const db = await getAdminFirestore();
  const reference = db.collection("chats").doc(chatId);
  return { db, reference, visitor };
}

async function getOwnedChat(
  context: NonNullable<Awaited<ReturnType<typeof getChatRequestContext>>>,
) {
  const { reference, visitor } = context;
  const snapshot = await reference.get();
  if (!snapshot.exists || snapshot.data()?.ownerIdHash !== visitor.ownerIdHash) {
    return null;
  }

  return { ...context, snapshot };
}

type MessagePayload = {
  text: string;
  upload: ChatAttachmentUpload | null;
};

async function readMessagePayload(request: NextRequest): Promise<MessagePayload> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim();

  if (contentType === "application/json") {
    const parsed = chatMessageInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      throw new ChatRequestError("El mensaje debe tener entre 1 y 1200 caracteres.", 400);
    }
    return { text: parsed.data.text, upload: null };
  }

  if (contentType !== "multipart/form-data") {
    throw new ChatRequestError("La solicitud debe usar JSON o multipart/form-data.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_MULTIPART_REQUEST_BYTES) {
    throw new ChatRequestError("El adjunto supera el límite permitido de 5 MB.", 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw new ChatRequestError("No fue posible leer el adjunto.", 400);
  }

  if (formData.getAll("file").length > 1) {
    throw new ChatRequestError("Solo puedes enviar un adjunto por mensaje.", 400);
  }

  const rawText = formData.get("text");
  if (rawText !== null && typeof rawText !== "string") {
    throw new ChatRequestError("El texto del mensaje no es válido.", 400);
  }
  const parsedText = chatMessageTextSchema.safeParse(rawText ?? "");
  if (!parsedText.success) {
    throw new ChatRequestError("El mensaje no puede superar 1200 caracteres.", 400);
  }

  const rawFile = formData.get("file");
  let upload: ChatAttachmentUpload | null = null;
  if (rawFile !== null) {
    if (typeof File === "undefined" || !(rawFile instanceof File)) {
      throw new ChatRequestError("El adjunto no es válido.", 400);
    }
    upload = rawFile;
  }
  if (!parsedText.data && !upload) {
    throw new ChatRequestError("Escribe un mensaje o selecciona una imagen.", 400);
  }

  return { text: parsedText.data, upload };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { chatId } = await context.params;
    const requestContext = await getChatRequestContext(request, chatId);
    if (!requestContext) {
      return jsonError("Conversación no encontrada.", 404);
    }

    const rateLimit = await consumeRateLimit(
      requestContext.db,
      `chat-read:${requestContext.visitor.ownerIdHash}`,
      READ_RATE_LIMIT,
    );
    if (!rateLimit.allowed) {
      return jsonError(
        "Demasiadas consultas. Espera antes de actualizar el chat.",
        429,
        rateLimit.retryAfterSeconds,
      );
    }

    const ownedChat = await getOwnedChat(requestContext);
    if (!ownedChat) {
      return jsonError("Conversación no encontrada.", 404);
    }

    const snapshot = await ownedChat.reference
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    const messages = [...snapshot.docs].reverse().map((document) => {
      const publicData = { ...document.data() };
      delete publicData.attachmentPath;
      return { id: document.id, ...publicData };
    });
    const response = NextResponse.json({ messages });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: unknown) {
    return handleChatServerError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { chatId } = await context.params;
    const payload = await readMessagePayload(request);

    const requestContext = await getChatRequestContext(request, chatId);
    if (!requestContext) {
      return jsonError("Conversación no encontrada.", 404);
    }

    const rateLimit = await consumeRateLimit(
      requestContext.db,
      `chat-message:${requestContext.visitor.ownerIdHash}`,
      MESSAGE_RATE_LIMIT,
    );
    if (!rateLimit.allowed) {
      return jsonError(
        "Has enviado varios mensajes seguidos. Espera un momento.",
        429,
        rateLimit.retryAfterSeconds,
      );
    }

    const ownedChat = await getOwnedChat(requestContext);
    if (!ownedChat) {
      return jsonError("Conversación no encontrada.", 404);
    }

    if (ownedChat.snapshot.data()?.status === "cerrado") {
      return jsonError("La conversación está cerrada. Inicia una nueva consulta.", 409);
    }

    const chatData = ownedChat.snapshot.data();
    const messageReference = ownedChat.reference.collection("messages").doc();
    const now = new Date().toISOString();
    let attachmentPath: string | undefined;
    let uploadedObject: {
      save(data: Buffer, options?: { resumable?: boolean; metadata?: Record<string, string> }): Promise<unknown>;
      delete(): Promise<unknown>;
    } | null = null;
    let attachmentUrl: string | undefined;

    if (payload.upload) {
      let normalizedAttachment: Buffer;
      try {
        normalizedAttachment = await normalizeChatAttachment(payload.upload);
      } catch {
        return jsonError(
          `El adjunto debe ser una imagen JPG, PNG o WebP válida de hasta ${Math.floor(MAX_CHAT_ATTACHMENT_BYTES / (1024 * 1024))} MB y ${Math.floor(MAX_CHAT_ATTACHMENT_OUTPUT_BYTES / 1024)} KB procesada.`,
          415,
        );
      }

      attachmentPath = getChatAttachmentPath(chatId, messageReference.id);
      const storageObject = getAdminStorageBucket().file(attachmentPath);
      uploadedObject = storageObject;
      try {
        await storageObject.save(normalizedAttachment, {
          resumable: false,
          metadata: {
            contentType: "image/jpeg",
            cacheControl: "private, max-age=0, no-store",
          },
        });
      } catch (error) {
        await storageObject.delete().catch(() => undefined);
        throw error;
      }
      attachmentUrl = `/api/chat/sessions/${chatId}/attachments/${messageReference.id}`;
    }

    const message = {
      id: messageReference.id,
      chatId,
      sender: "customer" as const,
      senderName: String(chatData?.customerName ?? "Visitante"),
      text: payload.text,
      createdAt: now,
      ...(attachmentUrl ? { attachmentUrl, attachmentType: "image" as const } : {}),
    };
    const firestoreMessage = {
      ...message,
      ...(attachmentPath ? { attachmentPath } : {}),
    };

    try {
      await ownedChat.db.runTransaction(async (transaction) => {
        const currentChat = await transaction.get(ownedChat.reference);
        if (
          !currentChat.exists ||
          currentChat.data()?.ownerIdHash !== ownedChat.visitor.ownerIdHash
        ) {
          throw new Error("Chat ownership changed");
        }
        if (currentChat.data()?.status === "cerrado") {
          throw new ChatRequestError(
            "La conversación está cerrada. Inicia una nueva consulta.",
            409,
          );
        }

        transaction.create(messageReference, firestoreMessage);
        transaction.update(ownedChat.reference, {
          lastMessage: message.text || "Imagen adjunta",
          lastMessageAt: now,
          unreadAdmin: FieldValue.increment(1),
          updatedAt: now,
        });
      });
    } catch (error) {
      if (uploadedObject) await uploadedObject.delete().catch(() => undefined);
      throw error;
    }

    const response = NextResponse.json({ message }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: unknown) {
    return handleChatServerError(error);
  }
}
