import prisma from '../lib/prisma.js';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStructs.js';
import { CreateComment } from '../structs/commentStructs.js';

class ArticleController {
  async getArticle(req, res) {
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
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    res.send(articles);
  }
  async createArticle(req, res) {
    assert(req.body, CreateArticle);

    const articles = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(articles);
  }
  async getArticleById(req, res) {
    const { id } = req.params;
    const articles = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    if (articles) {
      res.send(articles);
    } else {
      res.status(404).send({ message: 'Cannot find given id' });
    }
  }
  async updateArticle(req, res) {
    assert(req.body, PatchArticle);

    const { id } = req.params;
    const articles = await prisma.article.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.send(articles);
  }
  async deleteArticle(req, res) {
    const { id } = req.params;
    const articles = await prisma.article.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  }
  async createComment(req, res) {
    assert(req.body, CreateComment);

    const { id: articleId } = req.params;
    const { content } = req.body;
    const comments = await prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: Number(articleId) },
        },
      },
      include: {
        article: true,
      },
    });
    res.status(201).send(comments);
  }
  async getComment(req, res) {
    const { id: articleId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.comment.findMany({
      where: { articleId: Number(articleId) },
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
    res.send({
      data: comments,
    });
  }
}

export default new ArticleController();
