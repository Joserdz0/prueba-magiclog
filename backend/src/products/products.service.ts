import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, sellerId: number) {
    return this.prisma.products.create({
      data: {
        ...dto,
        seller_id: sellerId,
      },
    });
  }

  async search(filters: {
    name?: string;
    sku?: string;
    minPrice?: string;
    maxPrice?: string;
  }) {
    return this.prisma.products.findMany({
      where: {
        ...(filters.name && {
          name: { contains: filters.name.toLowerCase() },
        }),
        ...(filters.sku && {
          sku: { contains: filters.sku.toLowerCase() },
        }),
        ...(filters.minPrice || filters.maxPrice
          ? {
              price: {
                gte: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
                lte: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
              },
            }
          : {}),
      },
    });
  }


  async findBySeller(sellerId: number) {
    return this.prisma.products.findMany({
      where: { seller_id: sellerId },
    });
  }

  async findAll(filter?: { sellerId?: number }) {
    return this.prisma.products.findMany({
      where: {
        seller_id: filter?.sellerId,
      },
      include: {
        users: true, // si quieres ver los datos del vendedor
      },
    });
  }

  async searchBySellerEmail(email: string, filters: {
  name?: string;
  sku?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const seller = await this.prisma.users.findUnique({
    where: { email },
  });

  if (!seller) {
    throw new ForbiddenException('Vendedor no encontrado');
  }

  return this.prisma.products.findMany({
    where: {
      seller_id: seller.id,
      ...(filters.name && {
        name: { contains: filters.name.toLowerCase() },
      }),
      ...(filters.sku && {
        sku: { contains: filters.sku.toLowerCase() },
      }),
      ...(filters.minPrice || filters.maxPrice
        ? {
            price: {
              gte: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
              lte: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
            },
          }
        : {}),
    },
  });
}


}
