import sharp from "sharp";

export const MAX_CHAT_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const MAX_CHAT_ATTACHMENT_OUTPUT_BYTES = 750 * 1024;
export const CHAT_ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ChatAttachmentUpload = {
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
};

export async function normalizeChatAttachment(
  upload: ChatAttachmentUpload,
): Promise<Buffer> {
  if (!CHAT_ATTACHMENT_TYPES.includes(upload.type as (typeof CHAT_ATTACHMENT_TYPES)[number])) {
    throw new Error("Unsupported chat attachment type");
  }
  if (!Number.isSafeInteger(upload.size) || upload.size <= 0 || upload.size > MAX_CHAT_ATTACHMENT_BYTES) {
    throw new Error("Unsupported chat attachment size");
  }

  const input = Buffer.from(await upload.arrayBuffer());
  if (input.byteLength !== upload.size) throw new Error("Invalid chat attachment body");

  const output = await sharp(input, { limitInputPixels: 25_000_000 })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();

  if (output.byteLength > MAX_CHAT_ATTACHMENT_OUTPUT_BYTES) {
    throw new Error("Chat attachment output is too large");
  }
  return output;
}

export function getChatAttachmentPath(chatId: string, messageId: string): string {
  return `chat-attachments/${chatId}/${messageId}.jpg`;
}
