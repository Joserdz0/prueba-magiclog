import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // asegúrate de tenerlo
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDto) {
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const existing = await this.findByEmail(email);
    if (existing) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        email,
        password_hash: hashed,
        role: 'SELLER',
      },
    });

    const { password_hash, ...result } = user;
    return result;
  }
}
