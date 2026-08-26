import assert from "node:assert/strict";
import test from "node:test";
import {
  getAdminRouteRedirect,
  isAdminRole,
  resolveRole,
} from "../src/lib/auth-roles.ts";

test("los roles heredados solo aceptan correos exactos firmados", () => {
  assert.equal(resolveRole("admin@admin.com"), "superadmin");
  assert.equal(resolveRole("Vendedor@Vendedor.com"), "vendedor");
  assert.equal(resolveRole("superadmin-atacante@example.com"), "cliente");
  assert.equal(resolveRole("ventas@example.com"), "cliente");
});

test("un custom claim válido tiene prioridad sobre el allowlist temporal", () => {
  assert.equal(resolveRole("persona@example.com", { role: "superadmin" }), "superadmin");
  assert.equal(resolveRole("admin@admin.com", { role: "vendedor" }), "vendedor");
  assert.equal(resolveRole("admin@admin.com", { role: "root" }), "superadmin");
});

test("solo superadmin y vendedor se consideran personal administrativo", () => {
  assert.equal(isAdminRole("superadmin"), true);
  assert.equal(isAdminRole("vendedor"), true);
  assert.equal(isAdminRole("cliente"), false);
  assert.equal(isAdminRole(null), false);
});

test("las rutas administrativas fallan cerradas y categorías exige superadmin", () => {
  assert.equal(getAdminRouteRedirect("/admin", null, false), "/admin/login");
  assert.equal(getAdminRouteRedirect("/admin", "cliente", true), "/admin/login");
  assert.equal(
    getAdminRouteRedirect("/admin/categorias", "vendedor", true),
    "/admin/productos",
  );
  assert.equal(getAdminRouteRedirect("/admin/productos", "vendedor", true), null);
  assert.equal(getAdminRouteRedirect("/admin/categorias", "superadmin", true), null);
});
