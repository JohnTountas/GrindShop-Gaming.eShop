/**
 * Business logic for order placement, stock checks, and status transitions.
 */
import { randomUUID } from 'crypto';
import { hashSync } from 'bcryptjs';
import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { CreateOrderDTO, UpdateOrderStatusDTO } from './order.dto';
import { OrderStatus, Prisma, Product } from '@prisma/client';

type CheckoutItem = {
  productId: string;
  quantity: number;
  product: Product;
};

const guestCheckoutUserEmail = 'guest.checkout@grindspot.local';
const guestCheckoutPasswordHash = hashSync(randomUUID(), 10);

/**
 * Coordinates order placement and retrieval logic.
 */
export class OrderService {
  // Creates an order from member cart items or guest checkout items in one transaction.
  async create(userId: string | undefined, data: CreateOrderDTO) {
    const cartSnapshot = userId ? await this.getCartCheckoutItems(userId) : null;
    const checkoutItems = cartSnapshot?.items ?? (await this.getGuestCheckoutItems(data));

    if (checkoutItems.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Calculate total
    const total = checkoutItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      const resolvedUserId = userId ?? (await this.getGuestCheckoutUserId(tx));

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: resolvedUserId,
          total,
          shippingAddress: data.shippingAddress,
          status: 'PENDING',
          items: {
            create: checkoutItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Decrement stock
      for (const item of checkoutItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear the authenticated cart after the order is committed.
      if (cartSnapshot) {
        await tx.cartItem.deleteMany({
          where: { cartId: cartSnapshot.cartId },
        });
      }

      return newOrder;
    });

    return order;
  }

  // Loads the authenticated cart snapshot used to create an order.
  private async getCartCheckoutItems(userId: string): Promise<{ cartId: string; items: CheckoutItem[] }> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`The product "${item.product.title}" is currently out of stock.`, 400);
      }
    }

    return {
      cartId: cart.id,
      items: cart.items,
    };
  }

  // Resolves guest checkout payloads into product-backed order lines.
  private async getGuestCheckoutItems(data: CreateOrderDTO): Promise<CheckoutItem[]> {
    const guestItemQuantities = new Map<string, number>();

    for (const item of data.guestItems ?? []) {
      guestItemQuantities.set(
        item.productId,
        (guestItemQuantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    if (guestItemQuantities.size === 0) {
      throw new AppError('Cart is empty', 400);
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: Array.from(guestItemQuantities.keys()),
        },
      },
    });

    if (products.length !== guestItemQuantities.size) {
      throw new AppError('One or more products could not be found.', 404);
    }

    return products.map((product) => {
      const quantity = guestItemQuantities.get(product.id) ?? 0;

      if (product.stock < quantity) {
        throw new AppError(`The product "${product.title}" is currently out of stock.`, 400);
      }

      return {
        productId: product.id,
        quantity,
        product,
      };
    });
  }

  // Creates a dedicated hidden account used to anchor guest checkout orders.
  private async getGuestCheckoutUserId(tx: Prisma.TransactionClient): Promise<string> {
    const guestCheckoutUser = await tx.user.upsert({
      where: {
        email: guestCheckoutUserEmail,
      },
      update: {},
      create: {
        email: guestCheckoutUserEmail,
        passwordHash: guestCheckoutPasswordHash,
        firstName: 'Guest',
        lastName: 'Checkout',
      },
      select: {
        id: true,
      },
    });

    return guestCheckoutUser.id;
  }

  // Lists orders for a specific user in reverse chronological order.
  async findAll(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  // Finds one user-owned order with related product and category metadata.
  async findById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  // Lists orders for admin views with optional status filtering.
  async findAllOrders(filters?: { status?: OrderStatus }) {
    const where: Prisma.OrderWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  // Updates order status for admin order-lifecycle workflows.
  async updateStatus(orderId: string, data: UpdateOrderStatusDTO) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: data.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updated;
  }
}
