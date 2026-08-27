import { NextResponse } from "next/server";
import sharp from "sharp";
import { getAdminAuth, getAdminFirestore, FirebaseAdminConfigurationError } from "@/lib/firebase-admin";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { ChatRequestError, jsonError } from "@/lib/server/chat-http";

export const runtime = "nodejs";

const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 360 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

function bearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(header.trim());
  if (!match) throw new ChatRequestError("Debes iniciar sesión.", 401);
  return match[1];
}

async function requireSuperadmin(request: Request): Promise<string> {
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(bearerToken(request));
  } catch {
    throw new ChatRequestError("La sesión no es válida.", 401);
  }

  if (decoded.role !== "superadmin") {
    throw new ChatRequestError("No tienes permisos para cargar imágenes.", 403);
  }

  const decision = await consumeRateLimit(
    await getAdminFirestore(),
    `admin-product-image:${decoded.uid}`,
    { limit: 20, windowMs: 60_000, minIntervalMs: 500 },
  );
  if (!decision.allowed) {
    const error = new ChatRequestError("Demasiadas imágenes. Intenta nuevamente en unos segundos.", 429);
    Object.assign(error, { retryAfter: decision.retryAfterSeconds });
    throw error;
  }

  return decoded.uid;
}

async function removeBackground(input: Buffer, request: Request): Promise<Buffer | null> {
  const secret = process.env.REMBG_INTERNAL_SECRET;
  if (!secret) return null;

  const endpoint = new URL("/api/remove-background", request.url);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
      "x-rembg-secret": secret,
    },
    body: input as unknown as BodyInit,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new ChatRequestError("El recorte IA no está disponible temporalmente. Intenta nuevamente.", 503);
  }

  const output = Buffer.from(await response.arrayBuffer());
  if (output.byteLength === 0 || output.byteLength > MAX_INPUT_BYTES) {
    throw new ChatRequestError("El resultado del recorte IA no es válido.", 502);
  }
  return output;
}

async function renderProductImage(
  input: Buffer,
  request: Request,
): Promise<{ buffer: Buffer; width: number; height: number; usedAi: boolean }> {
  const removedBackground = await removeBackground(input, request);
  const sourceBuffer = removedBackground ?? input;
  const source = sharp(sourceBuffer, { limitInputPixels: 25_000_000, failOn: "error" });
  const metadata = await source.metadata();
  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
    throw new ChatRequestError("Usa una imagen JPG, PNG o WebP válida.", 415);
  }

  const qualities = [82, 72, 62];
  for (const quality of qualities) {
    const buffer = await sharp(sourceBuffer, { limitInputPixels: 25_000_000, failOn: "error" })
      .rotate()
      .resize(1000, 1000, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    if (buffer.byteLength <= MAX_OUTPUT_BYTES) {
      return { buffer, width: 1000, height: 1000, usedAi: Boolean(removedBackground) };
    }
  }

  throw new ChatRequestError("La imagen procesada sigue siendo demasiado pesada. Prueba con otra foto.", 413);
}

function errorResponse(error: unknown) {
  if (error instanceof ChatRequestError) {
    const retryAfter = "retryAfter" in error && typeof error.retryAfter === "number"
      ? error.retryAfter
      : undefined;
    return jsonError(error.message, error.status, retryAfter);
  }
  if (error instanceof FirebaseAdminConfigurationError) {
    return jsonError("La carga de imágenes no está disponible temporalmente.", 503);
  }

  console.error("Product image route failed", {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : undefined,
  });
  return jsonError("No fue posible procesar la imagen.", 500);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.startsWith("multipart/form-data")) {
      throw new ChatRequestError("La imagen debe enviarse como archivo.", 415);
    }

    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_INPUT_BYTES + 64 * 1024) {
      throw new ChatRequestError("La imagen no puede superar 8 MB.", 413);
    }

    await requireSuperadmin(request);
    const formData = await request.formData();
    const candidate = formData.get("file");
    if (!(candidate instanceof File)) {
      throw new ChatRequestError("Selecciona una imagen para continuar.", 400);
    }
    if (candidate.size === 0 || candidate.size > MAX_INPUT_BYTES) {
      throw new ChatRequestError("La imagen debe pesar entre 1 byte y 8 MB.", 413);
    }
    if (!ALLOWED_MIME_TYPES.has(candidate.type.toLowerCase())) {
      throw new ChatRequestError("Usa una imagen JPG, PNG o WebP.", 415);
    }

    const input = Buffer.from(await candidate.arrayBuffer());
    const rendered = await renderProductImage(input, request);
    const dataUrl = `data:image/jpeg;base64,${rendered.buffer.toString("base64")}`;

    return NextResponse.json(
      {
        dataUrl,
        width: rendered.width,
        height: rendered.height,
        processing: rendered.usedAi ? "rembg-white-canvas" : "white-canvas",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
