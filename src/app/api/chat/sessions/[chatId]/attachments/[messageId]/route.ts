import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore, getAdminStorageBucket } from "@/lib/firebase-admin";
import { getChatAttachmentPath } from "@/lib/server/chat-attachments";
import { isStaffRequest } from "@/lib/server/chat-auth";
import { handleChatServerError, jsonError } from "@/lib/server/chat-http";
import {
  getChatVisitor,
  getRequestRateLimitKey,
} from "@/lib/server/chat-visitor";
import { consumeRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const ATTACHMENT_READ_RATE_LIMIT = { limit: 30, windowMs: 60_000, minIntervalMs: 250 };

interface RouteContext {
  params: Promise<{ chatId: string; messageId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { chatId, messageId } = await context.params;
    if (
      !/^chat_[a-f0-9]{40}$/.test(chatId) ||
      !/^[A-Za-z0-9_-]{1,128}$/.test(messageId)
    ) {
      return jsonError("Adjunto no encontrado.", 404);
    }

    const staff = await isStaffRequest(request);
    const visitor = staff ? null : getChatVisitor(request);
    if (!staff && !visitor) return jsonError("Adjunto no encontrado.", 404);

    const db = await getAdminFirestore();
    const chatReference = db.collection("chats").doc(chatId);
    const chatSnapshot = await chatReference.get();
    if (
      !chatSnapshot.exists ||
      (!staff && chatSnapshot.data()?.ownerIdHash !== visitor?.ownerIdHash)
    ) {
      return jsonError("Adjunto no encontrado.", 404);
    }

    const rateLimit = await consumeRateLimit(
      db,
      `chat-attachment:${staff ? getRequestRateLimitKey(request) : visitor?.ownerIdHash}`,
      ATTACHMENT_READ_RATE_LIMIT,
    );
    if (!rateLimit.allowed) {
      return jsonError("Demasiadas descargas. Espera un momento.", 429, rateLimit.retryAfterSeconds);
    }

    const messageSnapshot = await chatReference.collection("messages").doc(messageId).get();
    const messageData = messageSnapshot.data();
    const expectedPath = getChatAttachmentPath(chatId, messageId);
    if (
      !messageSnapshot.exists ||
      messageData?.attachmentPath !== expectedPath ||
      messageData?.attachmentType !== "image"
    ) {
      return jsonError("Adjunto no encontrado.", 404);
    }

    const object = getAdminStorageBucket().file(expectedPath);
    const [exists] = await object.exists();
    if (!exists) return jsonError("Adjunto no encontrado.", 404);

    const [content] = await object.download();
    return new NextResponse(new Uint8Array(content), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": "image/jpeg",
        "Content-Disposition": `inline; filename="${messageId}.jpg"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    return handleChatServerError(error);
  }
}
