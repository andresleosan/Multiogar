import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const projectId = "multiogarweb";
const rules = await readFile(new URL("../firestore.rules", import.meta.url), "utf8");
let environment;

test.before(async () => {
  environment = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules,
    },
  });
});

test.beforeEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "products", "martillo"), {
      name: "Martillo",
      stock: 10,
      updatedAt: "2026-08-26T00:00:00.000Z",
    });
    await setDoc(doc(db, "categories", "manuales"), { name: "Manuales" });
    await setDoc(doc(db, "orders", "pedido-1"), { status: "pendiente" });
    await setDoc(doc(db, "chats", "chat-owner"), {
      ownerIdHash: "owner-hash",
      customerName: "Cliente",
      status: "abierto",
    });
    await setDoc(doc(db, "chats", "chat-owner", "messages", "message-1"), {
      text: "Consulta",
      sender: "customer",
    });
    await setDoc(doc(db, "chatRateLimits", "private"), { count: 1 });
  });
});

test.after(async () => {
  await environment.cleanup();
});

test("el catálogo mantiene lectura pública y bloquea escrituras anónimas", async () => {
  const db = environment.unauthenticatedContext().firestore();
  assert.equal((await assertSucceeds(getDoc(doc(db, "products", "martillo")))).exists(), true);
  assert.equal((await assertSucceeds(getDoc(doc(db, "categories", "manuales")))).exists(), true);
  await assertFails(setDoc(doc(db, "products", "nuevo"), { name: "Nuevo" }));
});

test("visitantes y clientes no acceden directamente a datos operativos", async () => {
  const anonymousDb = environment.unauthenticatedContext().firestore();
  const customerDb = environment
    .authenticatedContext("cliente-1", { role: "cliente", email: "cliente@example.com" })
    .firestore();
  const knownEmailWithoutClaimDb = environment
    .authenticatedContext("legacy-admin", { email: "admin@admin.com" })
    .firestore();

  for (const db of [anonymousDb, customerDb, knownEmailWithoutClaimDb]) {
    await assertFails(getDoc(doc(db, "orders", "pedido-1")));
    await assertFails(getDoc(doc(db, "chats", "chat-owner")));
    await assertFails(getDoc(doc(db, "chats", "chat-owner", "messages", "message-1")));
    await assertFails(getDoc(doc(db, "chatRateLimits", "private")));
  }
});

test("vendedor solo modifica stock y opera pedidos y chats", async () => {
  const db = environment
    .authenticatedContext("vendedor-1", { role: "vendedor", email: "ventas@example.com" })
    .firestore();

  await assertSucceeds(
    updateDoc(doc(db, "products", "martillo"), {
      stock: 9,
      updatedAt: "2026-08-26T01:00:00.000Z",
    }),
  );
  await assertFails(updateDoc(doc(db, "products", "martillo"), { name: "Alterado" }));
  await assertFails(setDoc(doc(db, "products", "nuevo"), { name: "Nuevo" }));
  await assertFails(deleteDoc(doc(db, "products", "martillo")));
  await assertFails(setDoc(doc(db, "categories", "electricas"), { name: "Eléctricas" }));
  await assertSucceeds(updateDoc(doc(db, "orders", "pedido-1"), { status: "atendido" }));
  await assertSucceeds(
    setDoc(doc(db, "chats", "chat-owner", "messages", "agent-1"), {
      text: "Respuesta",
      sender: "agent",
    }),
  );
  await assertFails(getDoc(doc(db, "chatRateLimits", "private")));
});

test("superadmin conserva la administración completa autorizada", async () => {
  const db = environment
    .authenticatedContext("admin-1", { role: "superadmin", email: "owner@example.com" })
    .firestore();

  await assertSucceeds(setDoc(doc(db, "products", "nuevo"), { name: "Nuevo" }));
  await assertSucceeds(setDoc(doc(db, "categories", "electricas"), { name: "Eléctricas" }));
  await assertSucceeds(deleteDoc(doc(db, "products", "martillo")));
  await assertSucceeds(getDoc(doc(db, "orders", "pedido-1")));
  await assertSucceeds(getDoc(doc(db, "chats", "chat-owner")));
  await assertFails(getDoc(doc(db, "chatRateLimits", "private")));
});
