import { NextResponse } from "next/server";
import { z } from "zod";
import type { UserRecord } from "firebase-admin/auth";
import { getAdminAuth, getAdminFirestore, FirebaseAdminConfigurationError } from "@/lib/firebase-admin";
import { isAppRole, type AppRole } from "@/lib/auth-roles";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { ChatRequestError, jsonError, readJsonBody } from "@/lib/server/chat-http";

const updateUserSchema = z.object({
  uid: z.string().trim().min(1).max(128),
  role: z.enum(["superadmin", "vendedor", "cliente"]),
}).strict();

type VerifiedAdmin = {
  uid: string;
};

function publicUser(user: UserRecord) {
  const candidate = user.customClaims?.role;
  const role: AppRole = isAppRole(candidate) ? candidate : "cliente";
  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    disabled: user.disabled,
    role,
  };
}

function bearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(header.trim());
  if (!match) throw new ChatRequestError("Debes iniciar sesión.", 401);
  return match[1];
}

async function requireSuperadmin(request: Request): Promise<VerifiedAdmin> {
  const token = bearerToken(request);
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch {
    throw new ChatRequestError("La sesión no es válida.", 401);
  }

  if (decoded.role !== "superadmin") {
    throw new ChatRequestError("No tienes permisos para administrar usuarios.", 403);
  }

  const decision = await consumeRateLimit(
    await getAdminFirestore(),
    `admin-users:${decoded.uid}`,
    { limit: 60, windowMs: 60_000, minIntervalMs: 250 },
  );
  if (!decision.allowed) {
    const error = new ChatRequestError("Demasiadas solicitudes. Intenta nuevamente.", 429);
    Object.assign(error, { retryAfter: decision.retryAfterSeconds });
    throw error;
  }

  return { uid: decoded.uid };
}

function errorResponse(error: unknown) {
  if (error instanceof ChatRequestError) {
    const retryAfter = "retryAfter" in error && typeof error.retryAfter === "number"
      ? error.retryAfter
      : undefined;
    return jsonError(error.message, error.status, retryAfter);
  }
  if (error instanceof FirebaseAdminConfigurationError) {
    return jsonError("La administración de usuarios no está disponible temporalmente.", 503);
  }
  console.error("Admin users route failed", {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : undefined,
  });
  return jsonError("No fue posible procesar la solicitud.", 500);
}

export async function GET(request: Request) {
  try {
    await requireSuperadmin(request);
    const result = await getAdminAuth().listUsers(1_000);
    return NextResponse.json(
      { users: result.users.map(publicUser) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireSuperadmin(request);
    const body = updateUserSchema.parse(await readJsonBody(request, 2_048));

    if (body.uid === admin.uid && body.role !== "superadmin") {
      return jsonError("No puedes quitarte el permiso de admin desde esta pantalla.", 409);
    }

    const auth = getAdminAuth();
    let user: UserRecord;
    try {
      user = await auth.getUser(body.uid);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "auth/user-not-found") {
        return jsonError("La cuenta no existe en Firebase Authentication.", 404);
      }
      throw error;
    }

    await auth.setCustomUserClaims(user.uid, { role: body.role });
    const updated = await auth.getUser(user.uid);
    return NextResponse.json(
      { user: publicUser(updated) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Indica una cuenta y un rol válido.", 400);
    }
    return errorResponse(error);
  }
}
