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

    return this.prisma.cart_items.create({
      data: {
        user_id: userId,
        product_id: dto.productId,
        quantity: dto.quantity,
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
