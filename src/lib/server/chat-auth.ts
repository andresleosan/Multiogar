import { getAdminAuth } from "@/lib/firebase-admin";
import { isAdminRole, resolveRole } from "@/lib/auth-roles";

const MAX_BEARER_LENGTH = 4_096;

function getBearerToken(request: Request): string | null {
  const value = request.headers.get("authorization")?.trim() ?? "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(value);
  if (!match || match[1].length > MAX_BEARER_LENGTH) return null;
  return match[1];
}

export async function isStaffRequest(request: Request): Promise<boolean> {
  return Boolean(await getStaffIdentity(request));
}

export interface StaffIdentity {
  uid: string;
  displayName: string;
}

export async function getStaffIdentity(request: Request): Promise<StaffIdentity | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    if (!isAdminRole(resolveRole(decoded.email ?? null, decoded))) return null;
    return {
      uid: decoded.uid,
      displayName: typeof decoded.name === "string" && decoded.name.trim()
        ? decoded.name.trim().slice(0, 80)
        : "Asesor Multiogar",
    };
  } catch {
    return null;
  }
}
