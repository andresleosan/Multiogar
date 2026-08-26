import { NextResponse } from "next/server";
import { FirebaseAdminConfigurationError } from "@/lib/firebase-admin";
import { ChatIdentityConfigurationError } from "@/lib/server/chat-visitor";

export class ChatRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ChatRequestError";
  }
}

export async function readJsonBody(
  request: Request,
  maxBytes = 4_096,
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim();
  if (contentType !== "application/json") {
    throw new ChatRequestError("La solicitud debe usar JSON.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ChatRequestError("La solicitud es demasiado grande.", 413);
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new ChatRequestError("La solicitud es demasiado grande.", 413);
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new ChatRequestError("El cuerpo JSON no es válido.", 400);
  }
}

export function jsonError(message: string, status: number, retryAfter?: number) {
  const response = NextResponse.json({ error: message }, { status });
  response.headers.set("Cache-Control", "no-store");
  if (retryAfter) response.headers.set("Retry-After", String(retryAfter));
  return response;
}

export function handleChatServerError(error: unknown) {
  if (error instanceof ChatRequestError) {
    return jsonError(error.message, error.status);
  }
  if (
    error instanceof FirebaseAdminConfigurationError ||
    error instanceof ChatIdentityConfigurationError
  ) {
    return jsonError("El chat no está disponible temporalmente.", 503);
  }

  console.error("Chat route failed", {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorCode:
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : undefined,
    errorStatus:
      error && typeof error === "object" && "status" in error
        ? String(error.status)
        : undefined,
    errorMessage:
      error instanceof Error
        ? error.message.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, "[redacted-jwt]").slice(0, 240)
        : undefined,
  });
  return jsonError("No fue posible procesar la solicitud.", 500);
}
