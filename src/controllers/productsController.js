import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

export async function createProduct(req, res) {
  const userId = req.userId;
  const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);

  const product = await prismaClient.product.create({
    data: { name, description, price, tags, images, userId },
  });

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.userId;

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError('product', id);
  }

  let isLiked = false;
  if (userId) {
    const favorite = await prismaClient.favorite.findFirst({
      where: { userId, productId: id },
    });
    isLiked = !!favorite;
  }

  return res.send({ ...product, isLiked });
}

export async function updateProduct(req, res) {
  const userId = req.userId;
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (existingProduct.userId !== userId) {
    throw new UnauthorizedError('상품을 수정할 권한이 없습니다.');
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const userId = req.userId;
  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prismaClient.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (existingProduct.userId !== userId) {
    throw new UnauthorizedError('상품을 삭제할 권한이 없습니다.');
  }

  await prismaClient.product.delete({ where: { id } });

  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);
  const userId = req.userId;

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
  });

  let productIds = [];
  let likedProducts = new Set();
  if (userId && products.length > 0) {
    productIds = products.map((p) => p.id);
    const favorites = await prismaClient.favorite.findMany({
      where: {
        userId,
        productId: { in: productIds },
      },
    });
    likedProducts = new Set(favorites.map((favorite) => favorite.productId));
  }

  const productsWithLiked = products.map((product) => ({
    ...product,
    isLiked: userId ? likedProducts.has(product.id) : false,
  }));

  return res.send({
    list: productsWithLiked,
    totalCount,
  });
}

export async function createComment(req, res) {
  const userId = req.userId;
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const comment = await prismaClient.comment.create({ data: { productId, content, userId } });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}
