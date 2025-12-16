import { prismaClient } from '../lib/prismaClient.js';
import { User } from '@prisma/client';
import { UpdateMeDTO } from '../types/dto.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prismaClient.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return prismaClient.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; nickname: string; password: string }): Promise<User> {
    return prismaClient.user.create({ data });
  }

  async update(id: number, data: UpdateMeDTO): Promise<User> {
    return prismaClient.user.update({ where: { id }, data });
  }

  async updatePassword(id: number, password: string): Promise<User> {
    return prismaClient.user.update({ where: { id }, data: { password } });
  }
}

