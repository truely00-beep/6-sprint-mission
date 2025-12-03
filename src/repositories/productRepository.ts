import { prismaClient } from '../lib/prismaClient.js';
import { Product, Favorite, Prisma } from '@prisma/client';
import { CreateProductDTO, UpdateProductDTO, PageParams } from '../types/dto.js';

export interface ProductWithFavoritesRelation extends Product {
  favorites: Favorite[];
}

export class ProductRepository {
  async create(data: CreateProductDTO & { userId: number }): Promise<Product> {
    return prismaClient.product.create({ data });
  }

  async findById(id: number): Promise<ProductWithFavoritesRelation | null> {
    return prismaClient.product.findUnique({
      where: { id },
      include: { favorites: true },
    });
  }

  async findByIdWithoutRelations(id: number): Promise<Product | null> {
    return prismaClient.product.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    return prismaClient.product.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.product.delete({ where: { id } });
  }

  async findMany(
    params: PageParams & { userId?: number }
  ): Promise<{ products: ProductWithFavoritesRelation[]; totalCount: number }> {
    const where: Prisma.ProductWhereInput = {
      ...(params.userId && { userId: params.userId }),
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

