import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  chatMessageInputSchema,
  chatSessionInputSchema,
} from "../src/lib/chat-contracts.ts";
import {
  getChatAttachmentPath,
  normalizeChatAttachment,
} from "../src/lib/server/chat-attachments.ts";
import { nextRateLimitState } from "../src/lib/server/rate-limit.ts";

test("los contratos del chat limpian y limitan la entrada", () => {
  assert.deepEqual(
    chatSessionInputSchema.parse({ name: "  María  ", phone: "+58 424 000 0000" }),
    { name: "María", phone: "+58 424 000 0000" },
  );
  assert.equal(chatSessionInputSchema.safeParse({ name: "A" }).success, false);
  assert.equal(
    chatSessionInputSchema.safeParse({ name: "Cliente", phone: "javascript" }).success,
    false,
  );
  assert.equal(
    chatMessageInputSchema.parse({ text: "  Necesito cemento  " }).text,
    "Necesito cemento",
  );
  assert.equal(chatMessageInputSchema.safeParse({ text: "x".repeat(1201) }).success, false);
});

test("el rate limit aplica intervalo, cupo y reinicio de ventana", () => {
  const policy = { limit: 2, windowMs: 10_000, minIntervalMs: 1_000 };
  const first = nextRateLimitState(null, 10_000, policy);
  assert.equal(first.allowed, true);

  const tooFast = nextRateLimitState(first.nextState, 10_500, policy);
  assert.equal(tooFast.allowed, false);
  assert.equal(tooFast.retryAfterSeconds, 1);

  const second = nextRateLimitState(first.nextState, 11_000, policy);
  assert.equal(second.allowed, true);
  const exhausted = nextRateLimitState(second.nextState, 12_000, policy);
  assert.equal(exhausted.allowed, false);

  const reset = nextRateLimitState(second.nextState, 20_000, policy);
  assert.equal(reset.allowed, true);
  assert.equal(reset.nextState.count, 1);
});

test("el widget público usa Route Handlers y no DataService para escribir", async () => {
  const widget = await readFile(
    new URL("../src/components/chat/LiveChatWidget.tsx", import.meta.url),
    "utf8",
  );
  assert.match(widget, /fetch\("\/api\/chat\/session"/);
  assert.match(widget, /\/api\/chat\/sessions\/\$\{chatId\}\/messages/);
  assert.doesNotMatch(widget, /DataService/);
  assert.doesNotMatch(widget, /localStorage\.setItem\([^)]*session/i);
});

test("la identidad temporal se entrega como cookie protegida", async () => {
  const identity = await readFile(
    new URL("../src/lib/server/chat-visitor.ts", import.meta.url),
    "utf8",
  );
  assert.match(identity, /httpOnly: true/);
  assert.match(identity, /sameSite: "lax"/);
  assert.match(identity, /timingSafeEqual/);
  assert.match(identity, /CHAT_SESSION_SECRET/);
});

test("los Route Handlers exigen JSON y limitan el tamaño del cuerpo", async () => {
  const http = await readFile(
    new URL("../src/lib/server/chat-http.ts", import.meta.url),
    "utf8",
  );
  assert.match(http, /contentType !== "application\/json"/);
  assert.match(http, /byteLength > maxBytes/);
  assert.match(http, /status: number/);
});

test("mensajes limita antes de leer la conversación y evita carreras de cierre", async () => {
  const route = await readFile(
    new URL(
      "../src/app/api/chat/sessions/[chatId]/messages/route.ts",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(route, /consumeRateLimit[\s\S]*?getOwnedChat\(requestContext\)/);
  assert.match(route, /currentChat\.data\(\)\?\.status === "cerrado"/);
  assert.match(route, /orderBy\("createdAt", "desc"\)/);
  assert.match(route, /\[\.\.\.snapshot\.docs\]\.reverse\(\)/);
});

test("Firestore reserva chats y rate limits para servidor o personal", async () => {
  const rules = await readFile(new URL("../firestore.rules", import.meta.url), "utf8");
  assert.match(
    rules,
    /match \/chats\/\{chatId\}[\s\S]*?allow read, write: if isStaff\(\);/,
  );
  assert.match(
    rules,
    /match \/chatRateLimits\/\{rateLimitId\}[\s\S]*?allow read, write: if false;/,
  );
});

test("Firebase Admin prioriza OIDC de Vercel sin una clave privada permanente", async () => {
  const admin = await readFile(
    new URL("../src/lib/firebase-admin.ts", import.meta.url),
    "utf8",
  );
  assert.match(admin, /getVercelOidcToken/);
  assert.match(admin, /type: "external_account"/);
  assert.match(admin, /service_account_impersonation_url/);
  assert.match(admin, /credential_source: \{ file: tokenPath/);
  assert.match(admin, /GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID/);
  assert.match(admin, /getVercelOidcToken\(\)/);
});

test("los adjuntos rechazan tipos o tamaños abusivos y tienen una ruta acotada", async () => {
  const invalid = {
    type: "application/pdf",
    size: 12,
    arrayBuffer: async () => new Uint8Array(12).buffer,
  };
  await assert.rejects(normalizeChatAttachment(invalid));

  const tooLarge = {
    type: "image/png",
    size: 5 * 1024 * 1024 + 1,
    arrayBuffer: async () => new ArrayBuffer(0),
  };
  await assert.rejects(normalizeChatAttachment(tooLarge));

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  );
  const normalized = await normalizeChatAttachment({
    type: "image/png",
    size: png.byteLength,
    arrayBuffer: async () => png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength),
  });
  assert.deepEqual([...normalized.subarray(0, 2)], [0xff, 0xd8]);

  assert.equal(
    getChatAttachmentPath("chat_" + "a".repeat(40), "message-1"),
    "chat-attachments/chat_" + "a".repeat(40) + "/message-1.jpg",
  );
});

test("el endpoint de adjuntos exige proxy autenticado y ruta interna", async () => {
  const route = await readFile(
    new URL(
      "../src/app/api/chat/sessions/[chatId]/attachments/[messageId]/route.ts",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(route, /isStaffRequest/);
  assert.match(route, /getChatVisitor/);
  assert.match(route, /attachmentPath !== expectedPath/);
  assert.match(route, /X-Content-Type-Options/);
  assert.match(route, /Cache-Control.*no-store/);

  const agentRoute = await readFile(
    new URL(
      "../src/app/api/chat/sessions/[chatId]/agent-message/route.ts",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(agentRoute, /getStaffIdentity/);
  assert.match(agentRoute, /chat-agent-message/);
  assert.match(agentRoute, /unreadCustomer: FieldValue\.increment\(1\)/);
});
