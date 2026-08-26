import { Product, Category, Order, ChatSession, ChatMessage } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS } from "@/lib/seed-data";

const PRODUCTS_KEY = "multiogar_db_products";
const CATEGORIES_KEY = "multiogar_db_categories";
const ORDERS_KEY = "multiogar_db_orders";
const CHATS_KEY = "multiogar_db_chats";
const MESSAGES_KEY = "multiogar_db_messages";

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
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

  createCategory(category: Omit<Category, "id">): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: category.slug,
    };
    const updated = [...categories, newCategory];
    setLocal(CATEGORIES_KEY, updated);
    return newCategory;
  },

  // ORDERS
  getOrders(): Order[] {
    return getLocal<Order[]>(ORDERS_KEY, INITIAL_ORDERS);
  },

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    setLocal(ORDERS_KEY, updated);
    return order;
  },

  updateOrderStatus(orderId: string, status: Order["status"]): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    setLocal(ORDERS_KEY, orders);
    return orders[index];
  },

  // CHATS
  getChatSessions(): ChatSession[] {
    const initialChats: ChatSession[] = [
      {
        id: "chat-sample-1",
        customerName: "Juan Camilo Botero",
        customerPhone: "3001234567",
        status: "abierto",
        lastMessage: "¿Tienen disponibilidad de brocas SDS Plus para concreto?",
        lastMessageAt: "2026-08-25T19:30:00Z",
        unreadAdmin: 1,
        unreadCustomer: 0,
        createdAt: "2026-08-25T19:28:00Z",
      },
      {
        id: "chat-sample-2",
        customerName: "Ferretería El Poblado",
        customerPhone: "3159988776",
        status: "en_atencion",
        assignedTo: "Mateo (Asesor)",
        lastMessage: "Le acabo de enviar la cotización con descuento por mayor.",
        lastMessageAt: "2026-08-25T18:15:00Z",
        unreadAdmin: 0,
        unreadCustomer: 0,
        createdAt: "2026-08-25T17:50:00Z",
      },
    ];
    return getLocal<ChatSession[]>(CHATS_KEY, initialChats);
  },

  getChatMessages(chatId: string): ChatMessage[] {
    const allMessages = getLocal<Record<string, ChatMessage[]>>(MESSAGES_KEY, {
      "chat-sample-1": [
        {
          id: "m1",
          chatId: "chat-sample-1",
          sender: "customer",
          senderName: "Juan Camilo",
          text: "Buenas tardes, ¿tienen disponibilidad de brocas SDS Plus para concreto?",
          createdAt: "2026-08-25T19:30:00Z",
        },
      ],
      "chat-sample-2": [
        {
          id: "m2",
          chatId: "chat-sample-2",
          sender: "customer",
          senderName: "Ferretería El Poblado",
          text: "Hola, necesito cotizar 20 bultos de cemento y 10 varillas de 1/2.",
          createdAt: "2026-08-25T17:50:00Z",
        },
        {
          id: "m3",
          chatId: "chat-sample-2",
          sender: "agent",
          senderName: "Mateo (Asesor)",
          text: "¡Hola! Con gusto. Le acabo de enviar la cotización con descuento por mayor.",
          createdAt: "2026-08-25T18:15:00Z",
        },
      ],
    });
    return allMessages[chatId] || [];
  },

  sendChatMessage(chatId: string, message: Omit<ChatMessage, "id" | "createdAt">): ChatMessage {
    const allMessages = getLocal<Record<string, ChatMessage[]>>(MESSAGES_KEY, {});
    const newMessage: ChatMessage = {
      ...message,
      id: "msg-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    if (!allMessages[chatId]) {
      allMessages[chatId] = [];
    }
    allMessages[chatId].push(newMessage);
    setLocal(MESSAGES_KEY, allMessages);

    // Update chat session
    const sessions = this.getChatSessions();
    const sessionIndex = sessions.findIndex((s) => s.id === chatId);
    if (sessionIndex > -1) {
      sessions[sessionIndex].lastMessage = message.text;
      sessions[sessionIndex].lastMessageAt = newMessage.createdAt;
      if (message.sender === "customer") {
        sessions[sessionIndex].unreadAdmin += 1;
      }
      setLocal(CHATS_KEY, sessions);
    }

    return newMessage;
  },

  createChatSession(customerName: string, customerPhone?: string, initialText?: string): ChatSession {
    const sessions = this.getChatSessions();
    const newSession: ChatSession = {
      id: "chat-" + Date.now(),
      customerName,
      customerPhone,
      status: "abierto",
      lastMessage: initialText || "Nueva conversación iniciada",
      lastMessageAt: new Date().toISOString(),
      unreadAdmin: 1,
      unreadCustomer: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newSession, ...sessions];
    setLocal(CHATS_KEY, updated);

    if (initialText) {
      this.sendChatMessage(newSession.id, {
        chatId: newSession.id,
        sender: "customer",
        senderName: customerName,
        text: initialText,
      });
    }

    return newSession;
  },

  // STATS FOR DASHBOARD
  getDashboardStats() {
    const products = this.getProducts();
    const orders = this.getOrders();
    const chats = this.getChatSessions();

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "pendiente").length;
    const completedOrders = orders.filter((o) => o.status === "completado").length;
    const lowStockProducts = products.filter((p) => p.stock <= 10).length;
    const totalActiveProducts = products.length;
    const openChats = chats.filter((c) => c.status !== "cerrado").length;

    // Sales by Category
    const categorySalesMap: Record<string, number> = {};
    orders.forEach((ord) => {
      ord.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const catName = prod ? prod.categoryName : "Otros";
        categorySalesMap[catName] = (categorySalesMap[catName] || 0) + item.price * item.quantity;
      });
    });

    const categorySales = Object.entries(categorySalesMap).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalOrders,
      totalSales,
      pendingOrders,
      completedOrders,
      lowStockProducts,
      totalActiveProducts,
      openChats,
      categorySales,
    };
  },
};