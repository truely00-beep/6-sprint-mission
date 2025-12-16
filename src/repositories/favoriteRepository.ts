import { prismaClient } from '../lib/prismaClient.js';
import { Favorite, Prisma } from '@prisma/client';
import { ProductWithFavoritesRelation } from './productRepository.js';

export class FavoriteRepository {
  async findFirst(productId: number, userId: number): Promise<Favorite | null> {
    return prismaClient.favorite.findFirst({
      where: { productId, userId },
    });
  }

  async create(productId: number, userId: number): Promise<Favorite> {
    return prismaClient.favorite.create({ data: { productId, userId } });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.favorite.delete({ where: { id } });
  }

  async findProductsByUserId(
    params: { page: number; pageSize: number; orderBy?: 'recent'; keyword?: string; userId: number }
  ): Promise<{ products: ProductWithFavoritesRelation[]; totalCount: number }> {
    const where: Prisma.ProductWhereInput = {
      favorites: {
        some: {
          userId: params.userId,
        },
      },
      ...(params.keyword && {
        OR: [{ name: { contains: params.keyword } }, { description: { contains: params.keyword } }],
      }),
    };

    const [products, totalCount] = await Promise.all([
      prismaClient.product.findMany({
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: params.orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
        where,
        include: { favorites: true },
      }),
      prismaClient.product.count({ where }),
    ]);

    return { products, totalCount };
  }
}

