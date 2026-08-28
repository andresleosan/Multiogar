"use client";

import { useEffect, useState } from "react";
import { getIdToken, type User } from "firebase/auth";

interface ChatAttachmentProps {
  url: string;
  user?: User | null;
}

export function ChatAttachment({ url, user = null }: ChatAttachmentProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let nextObjectUrl: string | null = null;

    void (async () => {
      try {
        setObjectUrl(null);
        setFailed(false);
        const headers: HeadersInit = {};
        if (user) headers.Authorization = `Bearer ${await getIdToken(user)}`;
        const response = await fetch(url, {
          headers,
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Attachment request failed");
        const blob = await response.blob();
        nextObjectUrl = URL.createObjectURL(blob);
        setObjectUrl(nextObjectUrl);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      }
    })();

    return () => {
      controller.abort();
      if (nextObjectUrl) URL.revokeObjectURL(nextObjectUrl);
    };
  }, [url, user]);

  if (failed) {
    return <span className="text-[10px] opacity-70">No fue posible cargar la imagen.</span>;
  }
  if (!objectUrl) {
    return <span className="text-[10px] opacity-70">Cargando imagen...</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={objectUrl}
      alt="Imagen adjunta del chat"
      className="max-h-56 max-w-full rounded object-contain"
    />
  );
}
