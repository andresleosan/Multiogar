import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  chatMessageInputSchema,
  chatSessionInputSchema,
} from "../src/lib/chat-contracts.ts";
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
  assert.match(admin, /ExternalAccountClient\.fromJSON/);
  assert.match(admin, /service_account_impersonation_url/);
  assert.match(admin, /GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID/);
  assert.match(admin, /getSubjectToken: async \(\) => getVercelOidcToken\(\)/);
});
