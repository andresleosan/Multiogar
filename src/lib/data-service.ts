import { Product, Category, Order, ChatSession, ChatMessage } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS } from "@/lib/seed-data";

// Versión del catálogo para forzar refresco de datos en clientes existentes
const DATA_VERSION = "multiogar_v4_facebook_catalog";
const VERSION_KEY = "multiogar_data_version";
const PRODUCTS_KEY = "multiogar_db_products";
const CATEGORIES_KEY = "multiogar_db_categories";
const ORDERS_KEY = "multiogar_db_orders";
const CHATS_KEY = "multiogar_db_chats";
const MESSAGES_KEY = "multiogar_db_messages";

function checkAndSyncVersion() {
  if (typeof window === "undefined") return;
  try {
    const currentVer = localStorage.getItem(VERSION_KEY);
    if (currentVer !== DATA_VERSION) {
      // Version changed: update products and categories to ensure fresh catalog
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
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
    return updatedProduct;
  },

  updateProductStock(id: string, newStock: number): boolean {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products[index].stock = newStock;
    products[index].updatedAt = new Date().toISOString();
    setLocal(PRODUCTS_KEY, products);
    return true;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    setLocal(PRODUCTS_KEY, filtered);
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

  createCategory(categoryData: Omit<Category, "id">): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...categoryData,
      id: "cat-" + Date.now(),
    };
    const updated = [...categories, newCat];
    setLocal(CATEGORIES_KEY, updated);
    return newCat;
  },

  // ORDERS
  getOrders(): Order[] {
    return getLocal<Order[]>(ORDERS_KEY, INITIAL_ORDERS);
  },

  getOrderById(id: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id);
  },

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    setLocal(ORDERS_KEY, updated);
    return order;
  },

  updateOrderStatus(orderId: string, status: Order["status"]): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return false;
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    setLocal(ORDERS_KEY, orders);
    return true;
  },

  // CHAT SESSIONS & MESSAGES
  getChatSessions(): ChatSession[] {
    const initialChats: ChatSession[] = [
      {
        id: "chat-sample-1",
        customerName: "Pedro Ramírez",
        customerPhone: "04141234567",
        lastMessage: "¿Tienen disponible la pistola de calor Ingco y el protector Lumistar 220V?",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        unreadAdmin: 1,
        unreadCustomer: 0,
        status: "abierto",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: "chat-sample-2",
        customerName: "Construcciones Ávila",
        customerPhone: "04245558899",
        lastMessage: "Buenas tardes, ¿precio por bulto del mastique Magic Gypsum y esmalte Prisma?",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        unreadAdmin: 0,
        unreadCustomer: 0,
        status: "en_atencion",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ];
    return getLocal<ChatSession[]>(CHATS_KEY, initialChats);
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
    const allMessages = getLocal<Record<string, ChatMessage[]>>(MESSAGES_KEY, {
      "chat-sample-1": [
        {
          id: "m-1",
          chatId: "chat-sample-1",
          sender: "customer",
          senderName: "Pedro Ramírez",
          text: "¿Tienen disponible la pistola de calor Ingco y el protector Lumistar 220V?",
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
      ],
    });
    return allMessages[chatId] || [];
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
    }

    return newMsg;
  },

  // ANALYTICS DASHBOARD
  getDashboardStats() {
    return this.getDashboardMetrics();
  },

  getDashboardMetrics() {
    const products = this.getProducts();
    const orders = this.getOrders();
    const chats = this.getChatSessions();

    const totalSales = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;
    const openChatsCount = chats.filter((c) => c.status === "abierto").length;

    // Categories Breakdown
    const categoriesMap: Record<string, number> = {};
    products.forEach((p) => {
      categoriesMap[p.categoryName] = (categoriesMap[p.categoryName] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoriesMap).map((catName) => ({
      name: catName,
      count: categoriesMap[catName],
    }));

    return {
      totalSales,
      totalOrders: orders.length,
      totalProducts,
      lowStockCount,
      openChatsCount,
      categoryDistribution,
      recentOrders: orders.slice(0, 5),
    };
  },
};