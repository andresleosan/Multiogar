export interface ProductVariant {
  id: string;
  name: string; // Ej: '1/2 pulgada', '3/4 pulgada', '110V', '220V', 'Rojo'
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string; // Category ID
  categoryName: string;
  brand: string;
  sku: string;
  basePrice: number;
  originalPrice?: number; // Para mostrar descuento
  images: string[];
  hasVariants: boolean;
  variants: ProductVariant[];
  stock: number;
  isFeatured: boolean;
  isOffer?: boolean;
  rating?: number;
  reviewsCount?: number;
  specs?: Record<string, string>; // Ej: { "Material": "Acero Cromo-Vanadio", "Garantía": "1 año" }
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string; // Lucide icon name
  image?: string;
  order: number;
  productCount?: number;
  featured: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
  maxStock: number;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  city: string;
  address?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // Ej: 'MH-2026-1042'
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee?: number;
  total: number;
  paymentMethod?: 'cashea' | 'por_coordinar';
  status: 'pendiente' | 'atendido' | 'enviado' | 'completado' | 'cancelado';
  channel: 'web' | 'whatsapp_web' | 'direct' | 'chat_web';
  whatsappUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: 'customer' | 'agent';
  senderName: string;
  text: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  createdAt: string;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerPhone?: string;
  status: 'abierto' | 'en_atencion' | 'cerrado';
  assignedTo?: string; // Nombre del asesor
  lastMessage: string;
  lastMessageAt: string;
  unreadAdmin: number;
  unreadCustomer: number;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'vendedor';
  active: boolean;
  avatarUrl?: string;
}
