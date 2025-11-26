import { create } from 'superstruct';
import { prisma } from '../lib/prismaClient.js';
import { NotFoundError } from '../lib/errors/customErrors.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import { UnauthorizedError } from '../lib/errors/customErrors.js';

//상품 등록
export async function createProduct(req, res) {
  const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);
  const user = req.user;
  const product = await prisma.product.create({
    data: { name, description, price, tags, images, userId: user.id },
  });
  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError('product', id);
  }

  return res.send(product);
}
//상품 수정
export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);
  const user = req.user;
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  if (product.userId !== user.id) {
    throw new UnauthorizedError();
  }
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });
  return res.send(updatedProduct);
}
//상품 삭제
export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  if (product.userId !== user.id) {
    throw new UnauthorizedError();
  }
  await prisma.product.delete({ where: { id } });
  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
          { tags: { has: keyword } },
        ],
      }
    : undefined;
  const totalCount = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
  });

  return res.send({
    list: products,
    totalCount,
  });
}
//댓글 등록
export async function createComment(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = req.user;
  await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  const comment = await prisma.comment.create({ data: { productId, content, userId: user.id } });
  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const commentsWithCursorComment = await prisma.comment.findMany({
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
