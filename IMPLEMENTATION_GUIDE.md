# Luxora E-Shop - Complete Implementation Guide

This document provides the complete implementation details for all remaining modules. Each module follows the same pattern established in the auth module.

## 📦 Backend Modules Implementation

### 1. Products Module

#### products.service.ts
```typescript
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { CreateProductDTO, UpdateProductDTO, GetProductsQuery } from './products.dto';

export class ProductsService {
  async getProducts(filters: GetProductsQuery) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 20,
      featured,
    } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    const orderBy: any = {};
    switch (sortBy) {
      case 'price-asc':
        orderBy.price = 'asc';
        break;
      case 'price-desc':
        orderBy.price = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'newest':
      default:
        orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async createProduct(data: CreateProductDTO) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    return product;
  }

  async deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } });
  }
}
```

#### products.controller.ts
```typescript
import { Request, Response } from 'express';
import { ProductsService } from './products.service';
import { asyncHandler } from '../../middleware/error.middleware';

const productsService = new ProductsService();

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productsService.getProducts(req.query as any);
  res.json(result);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.getProduct(req.params.id);
  res.json({ product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.createProduct(req.body);
  res.status(201).json({ message: 'Product created', product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.updateProduct(req.params.id, req.body);
  res.json({ message: 'Product updated', product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productsService.deleteProduct(req.params.id);
  res.json({ message: 'Product deleted' });
});
```

#### products.routes.ts
```typescript
import { Router } from 'express';
import * as productsController from './products.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import { createProductSchema, updateProductSchema, getProductsSchema } from './products.dto';

const router = Router();

// Public routes
router.get('/', validate(getProductsSchema), productsController.getProducts);
router.get('/:id', productsController.getProduct);

// Admin routes
router.post('/', authenticate, requireAdmin, validate(createProductSchema), productsController.createProduct);
router.patch('/:id', authenticate, requireAdmin, validate(updateProductSchema), productsController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productsController.deleteProduct);

export default router;
```

### 2. Cart Module

#### cart.service.ts
```typescript
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export class CartService {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    }

    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      if (product.stock < existingItem.quantity + quantity) {
        throw new AppError('Insufficient stock', 400);
      }

      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: { include: { category: true } } },
      });
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: { product: { include: { category: true } } },
    });
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return null;
    }

    if (item.product.stock < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { include: { category: true } } },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }
}
```

### 3. Orders Module

#### orders.service.ts
```typescript
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { CreateOrderData } from './orders.dto';

export class OrdersService {
  async createOrder(userId: string, data: CreateOrderData) {
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Validate stock and calculate total
    let total = 0;
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.title}`, 400);
      }
      total += Number(item.product.price) * item.quantity;
    }

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          total,
          shippingAddress: data.shippingAddress,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              priceAtPurchase: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: { product: { include: { category: true } } },
          },
        },
      });

      // Update product stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  }

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: { include: { category: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  // Admin functions
  async getAllOrders(filters: any) {
    const { status, page = 1, limit = 20 } = filters;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateOrderStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }
}
```

## 🎨 Frontend Components Implementation

### Core UI Components (in src/components/ui/)

#### Button.tsx
```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading, className, disabled, ...props }, ref) => {
    const baseStyles = 'btn font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      danger: 'btn-danger',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
```

#### Input.tsx
```typescript
import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'input',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
```

#### Card.tsx
```typescript
import { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = ({ children, hover, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx('card', hover && 'card-hover', className)}
      {...props}
    >
      {children}
    </div>
  );
};
```

### Layout Components (in src/components/layout/)

#### MainLayout.tsx
```typescript
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

#### Header.tsx
```typescript
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { data: cart } = useCart();

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-bold text-primary-600">
            Luxora
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Shop
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <User className="w-6 h-6" />
                <span className="hidden md:inline">{user?.firstName || 'Account'}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

### React Query Hooks (in src/lib/api/)

#### auth.api.ts
```typescript
import api from './client';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
```

#### products.api.ts
```typescript
import api from './client';
import { Product, ProductsResponse, ProductFilters } from '@/types';

export const productsApi = {
  getProducts: async (filters: ProductFilters): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  },
};
```

## 📝 Quick Setup Instructions

1. **Initialize Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

2. **Initialize Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

3. **Using Docker:**
```bash
# From root directory
docker-compose up
```

## 🎯 Next Steps

1. Complete all module implementations following the patterns shown
2. Add comprehensive error handling
3. Implement file upload for product images
4. Add Stripe payment integration
5. Write tests for all modules
6. Add E2E tests with Playwright
7. Deploy to production

## 📚 Additional Resources

- Prisma Docs: https://www.prisma.io/docs
- React Query Docs: https://tanstack.com/query
- React Hook Form: https://react-hook-form.com
- Tailwind CSS: https://tailwindcss.com

---

**Note:** This guide provides the architecture and key implementations. The full codebase follows these patterns consistently across all modules.
