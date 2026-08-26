import { NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore, FirebaseAdminConfigurationError } from "@/lib/firebase-admin";
import { isAppRole } from "@/lib/auth-roles";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { ChatRequestError, jsonError } from "@/lib/server/chat-http";
import { getPendingRoleAssignment, roleAssignmentId } from "@/lib/server/role-assignments";

function getBearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(header.trim());
  if (!match) throw new ChatRequestError("Debes iniciar sesión.", 401);
  return match[1];
}

export async function POST(request: Request) {
  try {
    const token = getBearerToken(request);
    let decoded;
    try {
      decoded = await getAdminAuth().verifyIdToken(token);
    } catch {
      throw new ChatRequestError("La sesión no es válida.", 401);
    }

    const db = await getAdminFirestore();
    const decision = await consumeRateLimit(db, `role-sync:${decoded.uid}`, {
      limit: 10,
      windowMs: 60_000,
      minIntervalMs: 500,
    });
    if (!decision.allowed) return jsonError("Demasiadas solicitudes. Intenta nuevamente.", 429, decision.retryAfterSeconds);

    const user = await getAdminAuth().getUser(decoded.uid);
    const email = user.email?.trim().toLowerCase();
    if (!email) return NextResponse.json({ role: isAppRole(decoded.role) ? decoded.role : "cliente" });

    const assignment = await getPendingRoleAssignment(db, email);
    if (!assignment) return NextResponse.json({ role: isAppRole(decoded.role) ? decoded.role : "cliente" });

    await getAdminAuth().setCustomUserClaims(user.uid, { role: assignment.role });
    await db.collection("roleAssignments").doc(roleAssignmentId(email)).delete();
    return NextResponse.json({ role: assignment.role }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ChatRequestError) return jsonError(error.message, error.status);
    if (error instanceof FirebaseAdminConfigurationError) return jsonError("La asignación de permisos no está disponible temporalmente.", 503);
    console.error("Role sync route failed", { errorName: error instanceof Error ? error.name : "UnknownError" });
    return jsonError("No fue posible sincronizar los permisos.", 500);
  }
}
