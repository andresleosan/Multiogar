import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Order } from "@/types";

export const FirestoreSync = {
  // Sync a product to Firestore
  async saveProduct(product: Product): Promise<void> {
    try {
      if (!db) return;
      const productRef = doc(db, "products", product.id);
      await setDoc(productRef, product, { merge: true });
    } catch (e) {
      console.warn("Firestore saveProduct (falling back to local state):", e);
    }
  },

  // Delete product from Firestore
  async deleteProduct(productId: string): Promise<void> {
    try {
      if (!db) return;
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
    } catch (e) {
      console.warn("Firestore deleteProduct warning:", e);
    }
  },

  // Sync an order to Firestore
  async saveOrder(order: Order): Promise<void> {
    try {
      if (!db) return;
      const orderRef = doc(db, "orders", order.id);
      await setDoc(orderRef, order, { merge: true });
    } catch (e) {
      console.warn("Firestore saveOrder (falling back to local state):", e);
    }
  },

  // Listen in real-time to products from Firestore
  subscribeProducts(onUpdate: (products: Product[]) => void) {
    try {
      if (!db) return () => {};
      const productsCol = collection(db, "products");
      return onSnapshot(productsCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((d) => list.push(d.data() as Product));
          onUpdate(list);
        }
      }, (err) => {
        console.warn("Firestore onSnapshot warning (using local products):", err);
      });
    } catch (e) {
      return () => {};
    }
  },
};