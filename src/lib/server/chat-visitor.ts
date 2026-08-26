import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "multiogar_chat_visitor";
const TOKEN_VERSION = "v1";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

export class ChatIdentityConfigurationError extends Error {
  constructor() {
    super("La identidad temporal del chat no está configurada.");
    this.name = "ChatIdentityConfigurationError";
  }
}

export interface ChatVisitorIdentity {
  visitorId: string;
  ownerIdHash: string;
  token: string;
  expiresAt: number;
  isNew: boolean;
}

function getChatSecret(): string {
  const secret = process.env.CHAT_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new ChatIdentityConfigurationError();
  }
  return secret;
}

function signTokenPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function buildToken(visitorId: string, expiresAt: number, secret: string): string {
  const payload = `${TOKEN_VERSION}.${visitorId}.${expiresAt}`;
  return `${payload}.${signTokenPayload(payload, secret)}`;
}

function parseToken(token: string | undefined, secret: string): Omit<ChatVisitorIdentity, "isNew"> | null {
  if (!token || token.length > 256) return null;

  const [version, visitorId, expiresAtText, signature, ...extra] = token.split(".");
  if (
    extra.length > 0 ||
    version !== TOKEN_VERSION ||
    !/^[A-Za-z0-9_-]{32,64}$/.test(visitorId ?? "") ||
    !/^\d{10,13}$/.test(expiresAtText ?? "") ||
    !/^[A-Za-z0-9_-]{40,64}$/.test(signature ?? "")
  ) {
    return null;
  }

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return null;

  const payload = `${version}.${visitorId}.${expiresAtText}`;
  const expected = signTokenPayload(payload, secret);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  return {
    visitorId,
    ownerIdHash: createHmac("sha256", secret).update(visitorId).digest("hex"),
    token,
    expiresAt,
  };
}

export function getChatVisitor(request: NextRequest): ChatVisitorIdentity | null {
  const secret = getChatSecret();
  const parsed = parseToken(request.cookies.get(COOKIE_NAME)?.value, secret);
  return parsed ? { ...parsed, isNew: false } : null;
}

export function getOrCreateChatVisitor(request: NextRequest): ChatVisitorIdentity {
  const existing = getChatVisitor(request);
  if (existing) return existing;

  const secret = getChatSecret();
  const visitorId = randomBytes(24).toString("base64url");
  const expiresAt = Date.now() + TOKEN_TTL_SECONDS * 1000;
  return {
    visitorId,
    ownerIdHash: createHmac("sha256", secret).update(visitorId).digest("hex"),
    token: buildToken(visitorId, expiresAt, secret),
    expiresAt,
    isNew: true,
  };
}

export function setChatVisitorCookie(
  response: NextResponse,
  identity: ChatVisitorIdentity,
): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: identity.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(identity.expiresAt),
  });
}

export function getConversationId(ownerIdHash: string): string {
  return `chat_${ownerIdHash.slice(0, 40)}`;
}

export function getRequestRateLimitKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(address).digest("hex");
}
