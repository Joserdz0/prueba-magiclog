import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@Controller("cart")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("BUYER",'ADMIN','SELLER') 
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async add(@Body() dto: AddToCartDto, @Request() req) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @Get()
  async get(@Request() req) {
    return this.cartService.getUserCart(req.user.userId);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Request() req) {
    return this.cartService.removeFromCart(Number(id), req.user.userId);
  }
}
