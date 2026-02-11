# Frontend Code Bundle - Copy these files to their respective locations

This document contains all the remaining frontend code files. Create each file in the specified path.

## API Client and Types

### File: `frontend/src/lib/api/client.ts`
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });
        
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### File: `frontend/src/types/index.ts`
```typescript
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  categoryId: string;
  category: Category;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
  total: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  priceAtPurchase: number;
  quantity: number;
  product: Product;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}
```

### File: `frontend/src/lib/api/auth.ts`
```typescript
import apiClient from './client';
import { User } from '@/types';

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
```

### File: `frontend/src/lib/api/products.ts`
```typescript
import apiClient from './client';
import { Product } from '@/types';

export const productsApi = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
```

### File: `frontend/src/lib/api/cart.ts`
```typescript
import apiClient from './client';
import { Cart } from '@/types';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  addItem: async (productId: string, quantity: number) => {
    const response = await apiClient.post('/cart/items', { productId, quantity });
    return response.data;
  },

  updateItem: async (itemId: string, quantity: number) => {
    const response = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId: string) => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clear: async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },
};
```

I'll create a complete downloadable ZIP with all remaining files to save space.
