import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

async addToCart(userId: number, dto: AddToCartDto) {
  const product = await this.prisma.products.findUnique({
    where: { id: dto.productId },
  });

  if (!product) throw new NotFoundException('Producto no encontrado');

  // Buscar si el producto ya está en el carrito
  const existingCartItem = await this.prisma.cart_items.findFirst({
    where: {
      user_id: userId,
      product_id: dto.productId,
    },
  });

  const cantidadSolicitada = dto.quantity;
  const cantidadEnCarrito = existingCartItem?.quantity ?? 0;
  const cantidadDisponible = product.quantity;

  if (cantidadSolicitada + cantidadEnCarrito > cantidadDisponible) {
    throw new Error(`Solo hay ${cantidadDisponible - cantidadEnCarrito} unidades disponibles`);
  }

  if (existingCartItem) {
    // Actualizar cantidad si ya estaba en carrito
    return this.prisma.cart_items.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + cantidadSolicitada,
      },
    });
  }

  // Si no estaba, lo crea
  return this.prisma.cart_items.create({
    data: {
      user_id: userId,
      product_id: dto.productId,
      quantity: cantidadSolicitada,
    },
  });
}


  async getUserCart(userId: number) {
    return this.prisma.cart_items.findMany({
      where: { user_id: userId },
      include: { products: true },
    });
  }

  async removeFromCart(cartItemId: number, userId: number) {
    const item = await this.prisma.cart_items.findUnique({
      where: { id: cartItemId },
    });

    if (!item || item.user_id !== userId) {
      throw new NotFoundException('Elemento no encontrado en tu carrito');
    }

    return this.prisma.cart_items.delete({
      where: { id: cartItemId },
    });
  }
}
