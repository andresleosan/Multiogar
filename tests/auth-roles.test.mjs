import assert from "node:assert/strict";
import test from "node:test";
import {
  getAdminRouteRedirect,
  getPostLoginRedirect,
  isAdminRole,
  resolveRole,
} from "../src/lib/auth-roles.ts";

test("un correo conocido no concede permisos sin un custom claim", () => {
  assert.equal(resolveRole("admin@admin.com"), "cliente");
  assert.equal(resolveRole("Vendedor@Vendedor.com"), "cliente");
  assert.equal(resolveRole("persona@example.com"), "cliente");
});

test("solo un custom claim válido concede un rol de personal", () => {
  assert.equal(resolveRole("persona@example.com", { role: "superadmin" }), "superadmin");
  assert.equal(resolveRole("admin@admin.com", { role: "vendedor" }), "vendedor");
  assert.equal(resolveRole("admin@admin.com", { role: "root" }), "cliente");
});

test("solo superadmin y vendedor se consideran personal administrativo", () => {
  assert.equal(isAdminRole("superadmin"), true);
  assert.equal(isAdminRole("vendedor"), true);
  assert.equal(isAdminRole("cliente"), false);
  assert.equal(isAdminRole(null), false);
});

test("las rutas administrativas fallan cerradas y categorías exige superadmin", () => {
  assert.equal(getAdminRouteRedirect("/admin", null, false), "/login?redirect=%2Fadmin");
  assert.equal(getAdminRouteRedirect("/admin", "cliente", true), "/login?redirect=%2Fadmin");
  assert.equal(
    getAdminRouteRedirect("/admin/categorias", "vendedor", true),
    "/admin/productos",
  );
  assert.equal(getAdminRouteRedirect("/admin/productos", "vendedor", true), null);
  assert.equal(getAdminRouteRedirect("/admin/categorias", "superadmin", true), null);
});

test("el retorno posterior al login solo acepta rutas locales y respeta roles", () => {
  assert.equal(getPostLoginRedirect("/producto/taladro", "cliente"), "/producto/taladro");
  assert.equal(getPostLoginRedirect(undefined, "superadmin"), "/admin");
  assert.equal(getPostLoginRedirect(undefined, "vendedor"), "/admin");
  assert.equal(getPostLoginRedirect("/admin/chats", "vendedor"), "/admin/chats");
  assert.equal(getPostLoginRedirect("/admin", "superadmin"), "/admin");
  assert.equal(getPostLoginRedirect("/admin", "cliente"), "/catalogo");
  assert.equal(getPostLoginRedirect("https://evil.example", "superadmin"), "/admin");
  assert.equal(getPostLoginRedirect("//evil.example", "superadmin"), "/admin");
  assert.equal(getPostLoginRedirect("/\\evil.example", "superadmin"), "/admin");
  assert.equal(getPostLoginRedirect("/%5cevil.example", "superadmin"), "/admin");
  assert.equal(getPostLoginRedirect("/login?redirect=/admin", "superadmin"), "/admin");
});
