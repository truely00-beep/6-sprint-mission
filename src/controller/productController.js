import prisma from '../lib/prisma.js';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStructs.js';
import { CreateComment } from '../structs/commentStructs.js';

class ProductController {
  async getProduct(req, res) {
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

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    res.send(products);
  }
  async createProduct(req, res) {
    assert(req.body, CreateProduct);

    const products = await prisma.product.create({
      data: req.body,
    });
    res.status(201).send(products);
  }
  async getProductById(req, res) {
    const { id } = req.params;
    const products = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (products) {
      res.send(products);
    } else {
      res.status(404).send({ message: 'Cannot find given id' });
    }
  }
  async updateProduct() {
    assert(req.body, PatchProduct);

    const { id } = req.params;
    const products = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.send(products);
  }
  async deleteProduct(req, res) {
    const { id } = req.params;
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

    //const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

    res.send({
      data: comments,
      //nextCursor,
    });
  }
}

export default new ProductController();
