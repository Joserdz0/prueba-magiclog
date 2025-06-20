import { Controller, Post, Get, Body, Request, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ForbiddenException } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER','ADMIN')
  @Post()
  async create(@Body() dto: CreateProductDto, @Request() req) {
    return this.productsService.create(dto, req.user.userId);
  }
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles('BUYER','SELLER','ADMIN')
  @Get('search')
  async searchProducts(
    @Query('name') name: string,
    @Query('sku') sku: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    return this.productsService.search({ name, sku, minPrice, maxPrice });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER','ADMIN')
  @Get('me')
  async getOwn(@Request() req) {
    return this.productsService.findBySeller(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  async getAll(@Request() req, @Query('sellerId') sellerId?: string) {
    const filter = sellerId ? { sellerId: Number(sellerId) } : {};
    return this.productsService.findAll(filter);
  }

    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/by-email')
  async getProductsByEmail(
    @Query('email') email: string,
    @Query() filters: any
  ) {
    if (!email) throw new ForbiddenException('Falta el email del vendedor');
    return this.productsService.searchBySellerEmail(email, filters);
  }
}
