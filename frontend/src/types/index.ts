/**
 * Shared frontend domain types aligned with backend API contracts.
 */
// User and authentication contracts mirrored from the backend auth module.
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Catalog entities used by list/detail pages and admin-facing product editing.
export interface ProductSpecification {
  id: string;
  productId: string;
  label: string;
  value: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string | null;
  authorName: string;
  title?: string | null;
  comment: string;
  rating: number;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  categoryId: string;
  category?: Category;
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
  featured?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// Category metadata powers filtering and navigation labels.
export interface Category {
  id: string;
  name: string;
  slang: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cart contracts back cart pages, checkout summaries, and quick-add interactions.
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  total?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

// Order contracts map directly to checkout, history, and detail experiences.
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  priceAtPurchase: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  stripePaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentIntentId?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

// Common API error envelope used by error helpers and mutation failure states.
export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
