import { Product, Category, Order, ChatSession, ChatMessage } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/lib/seed-data";
import { FirestoreSync } from "@/lib/firestore-sync";
import type { Unsubscribe } from "firebase/firestore";

// Versión del catálogo para forzar refresco de datos en clientes existentes
const DATA_VERSION = "multiogar_v6_no_mock_operations";
const VERSION_KEY = "multiogar_data_version";
const PRODUCTS_KEY = "multiogar_db_products";
const CATEGORIES_KEY = "multiogar_db_categories";
const ORDERS_KEY = "multiogar_db_orders";
const CHATS_KEY = "multiogar_db_chats";
const MESSAGES_KEY = "multiogar_db_messages";

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalActiveProducts: number;
  lowStockProducts: number;
  openChats: number;
  categorySales: Array<{ name: string; value: number }>;
  recentOrders: Order[];
}

function checkAndSyncVersion() {
  if (typeof window === "undefined") return;
  try {
    const currentVer = localStorage.getItem(VERSION_KEY);
    if (currentVer !== DATA_VERSION) {
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem(ORDERS_KEY, "[]");
      localStorage.setItem(CHATS_KEY, "[]");
      localStorage.setItem(MESSAGES_KEY, "{}");
    }
  } catch (e) {
    console.error("Error syncing data version:", e);
  }
}

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  checkAndSyncVersion();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error("Error reading localStorage:", e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing localStorage:", e);
  }
}

export const DataService = {
  // PRODUCTS
  getProducts(): Product[] {
    return getLocal<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  },

  subscribeProducts(callback: (products: Product[]) => void): Unsubscribe {
    const fallback = this.getProducts();
    return FirestoreSync.subscribeProducts(fallback, (products) => {
      setLocal(PRODUCTS_KEY, products);
      callback(products);
    });
  },

  createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setLocal(PRODUCTS_KEY, updated);

    // Sync to Firestore
    FirestoreSync.saveProduct(newProduct);

    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updatedProduct = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updatedProduct;
    setLocal(PRODUCTS_KEY, products);

    // Sync to Firestore
    FirestoreSync.saveProduct(updatedProduct);

    return updatedProduct;
  },

  updateProductStock(id: string, newStock: number): boolean {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products[index].stock = newStock;
    products[index].updatedAt = new Date().toISOString();
    setLocal(PRODUCTS_KEY, products);

    // Sync to Firestore
    FirestoreSync.saveProduct(products[index]);

    return true;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    setLocal(PRODUCTS_KEY, filtered);

    // Sync to Firestore
    FirestoreSync.deleteProduct(id);

    return true;
  },

  // CATEGORIES
  getCategories(): Category[] {
    return getLocal<Category[]>(CATEGORIES_KEY, INITIAL_CATEGORIES);
  },

  getCategoryBySlug(slug: string): Category | undefined {
    const categories = this.getCategories();
    return categories.find((c) => c.slug === slug);
  },

  subscribeCategories(callback: (categories: Category[]) => void): Unsubscribe {
    const fallback = this.getCategories();
    return FirestoreSync.subscribeCategories(fallback, (categories) => {
      setLocal(CATEGORIES_KEY, categories);
      callback(categories);
    });
  },

  createCategory(categoryData: Omit<Category, "id">): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...categoryData,
      id: "cat-" + Date.now(),
    };
    const updated = [...categories, newCat];
    setLocal(CATEGORIES_KEY, updated);
    FirestoreSync.saveCategory(newCat);
    return newCat;
  },

  // ORDERS
  getOrders(): Order[] {
    return getLocal<Order[]>(ORDERS_KEY, []);
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id);
  },

  subscribeOrders(callback: (orders: Order[]) => void): Unsubscribe {
    const fallback = this.getOrders();
    return FirestoreSync.subscribeOrders(fallback, (orders) => {
      setLocal(ORDERS_KEY, orders);
      callback(orders);
    });
  },

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    setLocal(ORDERS_KEY, updated);

    // Sync to Firestore
    FirestoreSync.saveOrder(order);

    return order;
  },

  updateOrderStatus(orderId: string, status: Order["status"]): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return false;
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    setLocal(ORDERS_KEY, orders);

    // Sync to Firestore
    FirestoreSync.saveOrder(orders[index]);

    return true;
  },

  // CHAT SESSIONS & MESSAGES
  getChatSessions(): ChatSession[] {
    return getLocal<ChatSession[]>(CHATS_KEY, []);
  },

  subscribeChatSessions(callback: (sessions: ChatSession[]) => void): Unsubscribe {
    const fallback = this.getChatSessions();
    return FirestoreSync.subscribeChatSessions(fallback, (sessions) => {
      setLocal(CHATS_KEY, sessions);
      callback(sessions);
    });
  },

  createChatSession(customerName: string, customerPhone?: string, initialMessage?: string): ChatSession {
    const sessions = this.getChatSessions();
    const newSession: ChatSession = {
      id: "chat-" + Date.now(),
      customerName,
      customerPhone,
      lastMessage: initialMessage || "Inició conversación",
      lastMessageAt: new Date().toISOString(),
      unreadAdmin: 1,
      unreadCustomer: 0,
      status: "abierto",
      createdAt: new Date().toISOString(),
    };
    const updated = [newSession, ...sessions];
    setLocal(CHATS_KEY, updated);

    // Sync to Firestore
    FirestoreSync.saveChatSession(newSession);

    if (initialMessage) {
      this.sendChatMessage(newSession.id, {
        chatId: newSession.id,
        sender: "customer",
        senderName: customerName,
        text: initialMessage,
      });
    }

    return newSession;
  },

  getChatMessages(chatId: string): ChatMessage[] {
    const allMessages = getLocal<Record<string, ChatMessage[]>>(MESSAGES_KEY, {});
    return allMessages[chatId] || [];
  },

  subscribeChatMessages(chatId: string, callback: (messages: ChatMessage[]) => void): Unsubscribe {
    const fallback = this.getChatMessages(chatId);
    return FirestoreSync.subscribeChatMessages(chatId, fallback, (messages) => {
      const allMessages = getLocal<Record<string, ChatMessage[]>>(MESSAGES_KEY, {});
      allMessages[chatId] = messages;
      setLocal(MESSAGES_KEY, allMessages);
      callback(messages);
    });
  },

  sendChatMessage(chatId: string, message: Omit<ChatMessage, "id" | "createdAt">): ChatMessage {
    const allMessages = getLocal<Record<string, ChatMessage[]>>(MESSAGES_KEY, {});
    const chatMsgs = allMessages[chatId] || [];
    const newMsg: ChatMessage = {
      ...message,
      id: "msg-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    allMessages[chatId] = [...chatMsgs, newMsg];
    setLocal(MESSAGES_KEY, allMessages);

    // Sync to Firestore
    FirestoreSync.saveChatMessage(chatId, newMsg);

    // Update parent session
    const sessions = this.getChatSessions();
    const sIndex = sessions.findIndex((s) => s.id === chatId);
    if (sIndex !== -1) {
      sessions[sIndex].lastMessage = newMsg.text;
      sessions[sIndex].lastMessageAt = newMsg.createdAt;
      if (newMsg.sender === "customer") {
        sessions[sIndex].unreadAdmin += 1;
      }
      setLocal(CHATS_KEY, sessions);
      FirestoreSync.saveChatSession(sessions[sIndex]);
    }

    return newMsg;
  },

  // ANALYTICS DASHBOARD
  getDashboardStats() {
    return this.getDashboardMetrics();
  },

  getDashboardMetrics(): DashboardMetrics {
    const products = this.getProducts();
    const orders = this.getOrders();
    const chats = this.getChatSessions();

    const activeOrders = orders.filter((order) => order.status !== "cancelado");
    const totalSales = activeOrders.reduce((total, order) => total + (order.total || 0), 0);
    const productById = new Map(products.map((product) => [product.id, product]));
    const salesByCategory = new Map<string, number>();

    for (const order of activeOrders) {
      for (const item of order.items) {
        const categoryName = productById.get(item.productId)?.categoryName ?? "Otros";
        const current = salesByCategory.get(categoryName) ?? 0;
        salesByCategory.set(categoryName, current + item.price * item.quantity);
      }
    }

    return {
      totalSales,
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === "pendiente").length,
      completedOrders: orders.filter((order) => order.status === "completado").length,
      totalActiveProducts: products.length,
      lowStockProducts: products.filter((product) => product.stock <= 15).length,
      openChats: chats.filter((chat) => chat.status === "abierto").length,
      categorySales: Array.from(salesByCategory, ([name, value]) => ({ name, value })),
      recentOrders: orders.slice(0, 5),
    };
  },
};
