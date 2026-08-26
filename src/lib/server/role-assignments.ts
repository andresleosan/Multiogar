import { createHash } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";
import { isAppRole, type AppRole } from "@/lib/auth-roles";

export type PendingRoleAssignment = {
  email: string;
  role: Exclude<AppRole, "cliente">;
  assignedByUid: string;
  createdAt: string;
  updatedAt: string;
};

export function normalizeAssignmentEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function roleAssignmentId(email: string): string {
  return createHash("sha256")
    .update(normalizeAssignmentEmail(email))
    .digest("hex");
}

export function isAssignableRole(value: unknown): value is Exclude<AppRole, "cliente"> {
  return value === "superadmin" || value === "vendedor";
}

export function readPendingAssignment(data: Record<string, unknown> | undefined): PendingRoleAssignment | null {
  const email = typeof data?.email === "string" ? normalizeAssignmentEmail(data.email) : "";
  const role = data?.role;
  if (!email || !isAssignableRole(role) || !isAppRole(role)) return null;
  return {
    email,
    role,
    assignedByUid: typeof data?.assignedByUid === "string" ? data.assignedByUid : "",
    createdAt: typeof data?.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data?.updatedAt === "string" ? data.updatedAt : "",
  };
}

export async function getPendingRoleAssignment(
  db: Firestore,
  email: string,
): Promise<PendingRoleAssignment | null> {
  const snapshot = await db.collection("roleAssignments").doc(roleAssignmentId(email)).get();
  return snapshot.exists ? readPendingAssignment(snapshot.data() as Record<string, unknown>) : null;
}
