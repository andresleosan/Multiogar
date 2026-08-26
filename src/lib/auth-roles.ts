export const APP_ROLES = ["superadmin", "vendedor", "cliente"] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type AdminRole = Exclude<AppRole, "cliente">;

const LEGACY_EMAIL_ROLES: Readonly<Record<string, AdminRole>> = {
  "admin@admin.com": "superadmin",
  "admin@multiogar.com": "superadmin",
  "vendedor@vendedor.com": "vendedor",
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

export function isAdminRole(role: AppRole | null): role is AdminRole {
  return role === "superadmin" || role === "vendedor";
}

export function resolveRole(
  email: string | null,
  claims: Readonly<Record<string, unknown>> = {},
): AppRole {
  if (isAppRole(claims.role)) {
    return claims.role;
  }

  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  return LEGACY_EMAIL_ROLES[normalizedEmail] ?? "cliente";
}

export function getAdminRouteRedirect(
  pathname: string,
  role: AppRole | null,
  isAuthenticated: boolean,
): string | null {
  if (!isAuthenticated || !isAdminRole(role)) {
    return "/admin/login";
  }

  if (pathname.startsWith("/admin/categorias") && role !== "superadmin") {
    return "/admin/productos";
  }

  return null;
}
