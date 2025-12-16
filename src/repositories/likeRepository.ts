import { prismaClient } from '../lib/prismaClient.js';
import { Like } from '@prisma/client';

export class LikeRepository {
  async findFirst(articleId: number, userId: number): Promise<Like | null> {
    return prismaClient.like.findFirst({
      where: { articleId, userId },
    });
  }

  async create(articleId: number, userId: number): Promise<Like> {
    return prismaClient.like.create({ data: { articleId, userId } });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.like.delete({ where: { id } });
  }
}

