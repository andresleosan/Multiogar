import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Order, ChatSession, ChatMessage } from "@/types";

export const FirestoreSync = {
  // Sync a product to Firestore
  async saveProduct(product: Product): Promise<void> {
    try {
      if (!db || typeof window === "undefined") return;
      const productRef = doc(db, "products", product.id);
      await setDoc(productRef, product, { merge: true });
    } catch (e) {
      // Non-blocking fallback
      console.warn("Firestore sync fallback (local state preserved):", e);
    }
  },

  // Delete product from Firestore
  async deleteProduct(productId: string): Promise<void> {
    try {
      if (!db || typeof window === "undefined") return;
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
    } catch (e) {
      console.warn("Firestore deleteProduct fallback:", e);
    }
  },

  // Sync an order to Firestore
  async saveOrder(order: Order): Promise<void> {
    try {
      if (!db || typeof window === "undefined") return;
      const orderRef = doc(db, "orders", order.id);
      await setDoc(orderRef, order, { merge: true });
    } catch (e) {
      console.warn("Firestore saveOrder fallback:", e);
    }
  },

  // Sync a chat session to Firestore
  async saveChatSession(session: ChatSession): Promise<void> {
    try {
      if (!db || typeof window === "undefined") return;
      const sessionRef = doc(db, "chats", session.id);
      await setDoc(sessionRef, session, { merge: true });
    } catch (e) {
      console.warn("Firestore saveChatSession fallback:", e);
    }
  },

  // Sync a chat message to Firestore
  async saveChatMessage(chatId: string, message: ChatMessage): Promise<void> {
    try {
      if (!db || typeof window === "undefined") return;
      const msgRef = doc(db, `chats/${chatId}/messages`, message.id);
      await setDoc(msgRef, message, { merge: true });
    } catch (e) {
      console.warn("Firestore saveChatMessage fallback:", e);
    }
  },
};