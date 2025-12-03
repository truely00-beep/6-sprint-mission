import prisma from '../lib/prisma.js';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStructs.js';
import { CreateComment } from '../structs/commentStructs.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

class ProductController {
  async getProducts(req, res) {
    const { offset = 0, limit = 10, order = 'newest', search = '' } = req.query;

    let orderBy;
    switch (order) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case ' newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const where = search
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

    //로그인 유저 아이디 가져오기
    const userId = req.user.id;

    //로그인 유저가 좋아요한 상품 조회
    const likeList = await prisma.like.findMany({
      where: {
        userId,
        productId: { not: null },
      },
      select: { productId: true },
    });

    const likeIds = likeList.map((item) => item.productId);

    //각 상품에 불린값 추가
    const result = products.map((p) => ({
      ...p,
      isLiked: likeIds.includes(p.id),
    }));
    res.send(result);
  }
  async createProduct(req, res) {
    assert(req.body, CreateProduct);
    const userId = req.user.id;

    const products = await prisma.product.create({
      data: {
        ...req.body,
        userId,
      },
    });
    res.status(201).send(products);
  }
  async getProductById(req, res) {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      throw new NotFoundError('해당 상품이 없습니다.');
    }

    //로그인 유저 가져오기
    const userId = req.user.id;

    //유저가 해당 상품에 좋아요 눌렀는지 조회
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        productId: Number(id),
      },
    });

    //반환
    return res.send({
      ...product,
      isLiked: Boolean(existingLike),
    });
  }
  async updateProduct() {
    assert(req.body, PatchProduct);

    const { id } = req.params;

    const loginUser = req.user;
    const existingProduct = await prisma.article.findUnique({ where: id });

    if (loginUser.id !== existingProduct.id) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const products = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.send(products);
  }
  async deleteProduct(req, res) {
    const { id } = req.params;

    const loginUser = req.user;
    const existingProduct = await prisma.article.findUnique({ where: id });

    if (loginUser.id !== existingProduct.id) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const products = await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  }
  async createComment(req, res) {
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
  async getComment(req, res) {
    const { id } = req.params;
    const { cursor, limit = 10 } = req.query;

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
