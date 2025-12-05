import prisma from '../lib/prisma';
import { Category } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStructs';
import { CreateComment } from '../structs/commentStructs';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import ValidationError from '../lib/errors/ValidationError';

class ProductController {
  async getProducts(
    req: Request<
      any,
      any,
      any,
      { offset?: string; limit?: string; order?: string; search?: string }
    >,
    res: Response,
  ) {
    const { offset = '0', limit = '10', order = 'newest', search = '' } = req.query;

    let orderBy: object;
    switch (order) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case ' newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const where: object = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    //상품 목록 가져오기
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    res.send(products);
  }
  async createProduct(req: AuthenticatedRequest, res: Response) {
    assert(req.body, CreateProduct);

    const userId = req.user.id;

    const { category, ...rest } = req.body;

    if (!Object.values(Category).includes(category as Category)) {
      throw new ForbiddenError('유효하지 않은 카테고리입니다.');
    }

    const products = await prisma.product.create({
      data: {
        ...rest,
        category: category as Category,
        userId,
      },
    });
    res.status(201).send(products);
  }
  async getProductById(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      throw new NotFoundError('해당 상품이 없습니다.');
    }

    //반환
    return res.send(product);
  }
  async updateProduct(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    assert(req.body, PatchProduct);

    const { id } = req.params;

    const { category, ...rest } = req.body;

    if (!Object.values(Category).includes(category as Category)) {
      throw new ForbiddenError('유효하지 않은 카테고리입니다.');
    }

    const loginUser = req.user;
    const existingProduct = await prisma.article.findUnique({ where: { id } });

    if (!existingProduct) {
      throw new NotFoundError('해당 상품이 없습니다.');
    }
    if (loginUser.id !== existingProduct.id) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const products = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        category: category as Category,
      },
    });
    res.send(products);
  }
  async deleteProduct(req: Request<{ id: number }>, res: Response) {
    const { id } = req.params;

    const loginUser = req.user;

    if (!loginUser) {
      throw new ValidationError('로그인이 필요합니다.');
    }
    const existingProduct = await prisma.article.findUnique({ where: { id } });

    if (!existingProduct) {
      throw new NotFoundError('해당 상품이 없습니다.');
    }
    if (loginUser.id !== existingProduct.id) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const products = await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  }
  async createComment(req: Request, res: Response) {
    assert(req.body, CreateComment);

    const { id } = req.params;
    const { content } = req.body;
    const comments = await prisma.comment.create({
      data: {
        content,
        product: {
          connect: { id: Number(id) },
        },
      },
      include: {
        product: true,
      },
    });
    res.status(201).send(comments);
  }
  async getComment(
    req: Request<{ id: string }, any, any, { cursor?: number; limit?: string }>,
    res: Response,
  ) {
    const { id } = req.params;
    const { cursor, limit = '10' } = req.query;

    const comments = await prisma.comment.findMany({
      where: { productId: Number(id) },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      take: parseInt(limit),
      ...(cursor
        ? {
            skip: 1,
            cursor: { id: cursor },
          }
        : {}),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

    res.send({
      data: comments,
      nextCursor,
    });
  }
}

export default new ProductController();
