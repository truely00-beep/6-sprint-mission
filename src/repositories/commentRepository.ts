import { prismaClient } from '../lib/prismaClient.js';
import { Comment } from '@prisma/client';
import { UpdateCommentDTO, CursorParams } from '../types/dto.js';

export class CommentRepository {
  async create(data: { content: string; productId?: number; articleId?: number; userId: number }): Promise<Comment> {
    return prismaClient.comment.create({ data });
  }

  async findById(id: number): Promise<Comment | null> {
    return prismaClient.comment.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateCommentDTO): Promise<Comment> {
    return prismaClient.comment.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.comment.delete({ where: { id } });
  }

  async findManyByProductId(params: CursorParams & { productId: number }): Promise<Comment[]> {
    return prismaClient.comment.findMany({
      cursor: params.cursor ? { id: params.cursor } : undefined,
      take: params.limit + 1,
      where: { productId: params.productId },
    });
  }

  async findManyByArticleId(params: CursorParams & { articleId: number }): Promise<Comment[]> {
    return prismaClient.comment.findMany({
      cursor: params.cursor ? { id: params.cursor } : undefined,
      take: params.limit + 1,
      where: { articleId: params.articleId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

