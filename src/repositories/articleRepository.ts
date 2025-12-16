import { prismaClient } from '../lib/prismaClient.js';
import { Article, Like, Prisma } from '@prisma/client';
import { CreateArticleDTO, UpdateArticleDTO, PageParams } from '../types/dto.js';

export interface ArticleWithLikesRelation extends Article {
  likes: Like[];
}

export class ArticleRepository {
  async create(data: CreateArticleDTO & { userId: number }): Promise<Article> {
    return prismaClient.article.create({ data });
  }

  async findById(id: number): Promise<ArticleWithLikesRelation | null> {
    return prismaClient.article.findUnique({
      where: { id },
      include: { likes: true },
    });
  }

  async findByIdWithoutRelations(id: number): Promise<Article | null> {
    return prismaClient.article.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateArticleDTO): Promise<Article> {
    return prismaClient.article.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.article.delete({ where: { id } });
  }

  async findMany(params: PageParams): Promise<{ articles: ArticleWithLikesRelation[]; totalCount: number }> {
    const where: Prisma.ArticleWhereInput = {
      ...(params.keyword && { title: { contains: params.keyword } }),
    };

    const [articles, totalCount] = await Promise.all([
      prismaClient.article.findMany({
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: params.orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
        where,
        include: { likes: true },
      }),
      prismaClient.article.count({ where }),
    ]);

    return { articles, totalCount };
  }
}

