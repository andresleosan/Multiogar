import { FieldValue } from "@google-cloud/firestore";
import { NextRequest, NextResponse } from "next/server";
import { chatMessageInputSchema } from "@/lib/chat-contracts";
import { getAdminFirestore } from "@/lib/firebase-admin";
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
    const messages = [...snapshot.docs].reverse().map((document) => ({
      id: document.id,
      ...document.data(),
    }));
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
    const parsed = chatMessageInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return jsonError("El mensaje debe tener entre 1 y 1200 caracteres.", 400);
    }

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

    const chatData = ownedChat.snapshot.data();
    const messageReference = ownedChat.reference.collection("messages").doc();
    const now = new Date().toISOString();
    const message = {
      id: messageReference.id,
      chatId,
      sender: "customer" as const,
      senderName: String(chatData?.customerName ?? "Visitante"),
      text: parsed.data.text,
      createdAt: now,
    };

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

      transaction.create(messageReference, message);
      transaction.update(ownedChat.reference, {
        lastMessage: message.text,
        lastMessageAt: now,
        unreadAdmin: FieldValue.increment(1),
        updatedAt: now,
      });
    });

    const response = NextResponse.json({ message }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error: unknown) {
    return handleChatServerError(error);
  }
}
