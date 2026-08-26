import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("la gestión de usuarios valida identidad, rol y límite en servidor", async () => {
  const route = await source("src/app/api/admin/users/route.ts");

  assert.match(route, /verifyIdToken/);
  assert.match(route, /decoded\.role !== "superadmin"/);
  assert.match(route, /consumeRateLimit/);
  assert.match(route, /setCustomUserClaims/);
  assert.match(route, /assignRoleSchema/);
  assert.match(route, /roleAssignments/);
  assert.match(route, /export async function POST/);
  assert.match(route, /user\.uid === admin\.uid && body\.role !== "superadmin"/);
  assert.match(route, /body\.uid === admin\.uid && body\.role !== "superadmin"/);
  assert.match(route, /z\.enum\(\["superadmin", "vendedor", "cliente"\]\)/);
  assert.doesNotMatch(route, /password/i);
});

test("el panel de permisos usa el endpoint y ofrece los tres niveles", async () => {
  const page = await source("src/app/admin/usuarios/page.tsx");
  const layout = await source("src/app/admin/layout.tsx");

  assert.match(page, /\/api\/admin\/users/);
  assert.match(page, /Authorization: `Bearer \$\{token\}`/);
  assert.match(page, /superadmin: "Admin"/);
  assert.match(page, /vendedor: "Vendedor"/);
  assert.match(page, /cliente: "Cliente"/);
  assert.match(page, /Asignar acceso por correo/);
  assert.match(page, /Asignaciones pendientes/);
  assert.match(layout, /href: "\/admin\/usuarios"/);
  assert.match(layout, /roles: \["superadmin"\]/);
  assert.match(layout, /currentUserLabel/);
  assert.doesNotMatch(layout, /Administrador Multiogar/);
});

test("el primer acceso sincroniza una asignación pendiente", async () => {
  const route = await source("src/app/api/auth/role-sync/route.ts");
  const auth = await source("src/lib/firebase-auth.ts");

  assert.match(route, /verifyIdToken/);
  assert.match(route, /getPendingRoleAssignment/);
  assert.match(route, /setCustomUserClaims/);
  assert.match(auth, /\/api\/auth\/role-sync/);
  assert.match(auth, /syncAssignedRole/);
});
