import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sanitizeProductDescription } from "@/lib/utils";
import type { Category, ChatMessage, ChatSession, Order, Product } from "@/types";

type SyncableRecord = { id: string };
type RemoteProduct = Product & { deletedAt?: string };

function sanitizeProduct<T extends Product>(product: T): T {
  return {
    ...product,
    description: sanitizeProductDescription(product.description ?? ""),
  };
}

function mergeRemote<T extends SyncableRecord>(fallback: T[], remote: T[]): T[] {
  const remoteById = new Map(remote.map((item) => [item.id, item]));
  const merged = fallback.map((item) => remoteById.get(item.id) ?? item);
  const fallbackIds = new Set(fallback.map((item) => item.id));

  return [...merged, ...remote.filter((item) => !fallbackIds.has(item.id))];
}

function parseDocument<T extends SyncableRecord>(snapshot: QueryDocumentSnapshot<DocumentData>): T {
  return { ...snapshot.data(), id: snapshot.id } as T;
}

function subscribeCollection<T extends SyncableRecord>(
  path: string,
  fallback: T[],
  onData: (items: T[]) => void,
  transform?: (snapshots: QueryDocumentSnapshot<DocumentData>[], fallback: T[]) => T[],
): Unsubscribe {
  onData(fallback);

  if (!db || typeof window === "undefined") {
    return () => undefined;
  }

  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const snapshots = snapshot.docs;
      const items = transform
        ? transform(snapshots, fallback)
        : mergeRemote(fallback, snapshots.map((item) => parseDocument<T>(item)));
      onData(items);
    },
    (error) => {
      console.warn(`Firestore subscription fallback (${path}):`, error);
      onData(fallback);
    },
  );
}

async function saveDocument<T extends SyncableRecord>(path: string, value: T): Promise<void> {
  try {
    if (!db || typeof window === "undefined") return;
    await setDoc(doc(db, path, value.id), value, { merge: true });
  } catch (error) {
    console.warn(`Firestore write fallback (${path}):`, error);
  }
}

export const FirestoreSync = {
  subscribeProducts(fallback: Product[], onData: (products: Product[]) => void): Unsubscribe {
    const sanitizedFallback = fallback.map(sanitizeProduct);

    return subscribeCollection<Product>("products", sanitizedFallback, onData, (snapshots, localProducts) => {
      const remote = snapshots.map((item) => parseDocument<RemoteProduct>(item));
      const deletedIds = new Set(
        remote.filter((product) => Boolean(product.deletedAt)).map((product) => product.id),
      );
      const activeRemote = remote
        .filter((product) => !product.deletedAt)
        .map((product) => {
          const activeProduct = sanitizeProduct(product);
          delete activeProduct.deletedAt;
          return activeProduct;
        });

      return mergeRemote(
        localProducts.filter((product) => !deletedIds.has(product.id)),
        activeRemote,
      );
    });
  },

  subscribeCategories(fallback: Category[], onData: (categories: Category[]) => void): Unsubscribe {
    return subscribeCollection("categories", fallback, onData);
  },

  subscribeOrders(fallback: Order[], onData: (orders: Order[]) => void): Unsubscribe {
    return subscribeCollection("orders", fallback, onData, (snapshots, localOrders) =>
      mergeRemote(
        localOrders,
        snapshots
          .map((item) => parseDocument<Order>(item))
          .filter((order) => order.id !== "ord-1001" && order.id !== "ord-1002"),
      ).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  },

  subscribeChatSessions(fallback: ChatSession[], onData: (sessions: ChatSession[]) => void): Unsubscribe {
    return subscribeCollection("chats", fallback, onData, (snapshots, localSessions) =>
      mergeRemote(
        localSessions,
        snapshots
          .map((item) => parseDocument<ChatSession>(item))
          .filter((session) => !session.id.startsWith("chat-sample-")),
      ).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)),
    );
  },

  subscribeChatMessages(
    chatId: string,
    fallback: ChatMessage[],
    onData: (messages: ChatMessage[]) => void,
  ): Unsubscribe {
    return subscribeCollection(`chats/${chatId}/messages`, fallback, (messages) =>
      onData([...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt))),
    );
  },

  saveProduct(product: Product): Promise<void> {
    return saveDocument("products", product);
  },

  async deleteProduct(productId: string): Promise<void> {
    await saveDocument("products", {
      id: productId,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  saveCategory(category: Category): Promise<void> {
    return saveDocument("categories", category);
  },

  saveOrder(order: Order): Promise<void> {
    return saveDocument("orders", order);
  },

  saveChatSession(session: ChatSession): Promise<void> {
    return saveDocument("chats", session);
  },

  saveChatMessage(chatId: string, message: ChatMessage): Promise<void> {
    return saveDocument(`chats/${chatId}/messages`, message);
  },
};
