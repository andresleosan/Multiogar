export const APP_ROLES = ["superadmin", "vendedor", "cliente"] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type AdminRole = Exclude<AppRole, "cliente">;

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

export function isAdminRole(role: AppRole | null): role is AdminRole {
  return role === "superadmin" || role === "vendedor";
}

export function resolveRole(
  _email: string | null,
  claims: Readonly<Record<string, unknown>> = {},
): AppRole {
  return isAppRole(claims.role) ? claims.role : "cliente";
}

export function getAdminRouteRedirect(
  pathname: string,
  role: AppRole | null,
  isAuthenticated: boolean,
): string | null {
  if (!isAuthenticated || !isAdminRole(role)) {
    return `/login?redirect=${encodeURIComponent(pathname)}`;
  }

  if (pathname.startsWith("/admin/categorias") && role !== "superadmin") {
    return "/admin/productos";
  }

  return null;
}

export function getPostLoginRedirect(
  requestedPath: string | null | undefined,
  role: AppRole,
): string {
  let isSafeLocalPath = false;
  if (
    typeof requestedPath === "string" &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.includes("\\") &&
    !/%(?:2f|5c)/i.test(requestedPath) &&
    !requestedPath.startsWith("/login")
  ) {
    try {
      isSafeLocalPath =
        new URL(requestedPath, "https://multiogar.local").origin ===
        "https://multiogar.local";
    } catch {
      isSafeLocalPath = false;
    }
  }
  if (isAdminRole(role)) {
    // Staff always lands in the work panel; preserve a safe deep link when one
    // was explicitly requested from another administrative screen.
    if (isSafeLocalPath && requestedPath?.startsWith("/admin")) {
      return requestedPath;
    }
    return "/admin";
  }

  const destination = isSafeLocalPath && requestedPath ? requestedPath : "/catalogo";

  if (destination.startsWith("/admin")) {
    return "/catalogo";
  }
  return destination;
}
