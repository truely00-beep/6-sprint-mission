import { prisma } from '../utils/prismaClient.js';

export class ArticleController {
  static getArticles = async (req, res) => {
    const { offset = 0, limit = 10, order, search } = req.query;
    const orderByOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    };
    const where = search
      ? { OR: [{ title: { contains: search } }, { content: { contains: search } }] }
      : {};

    const article = await prisma.article.findMany({
      where,
      orderBy: orderByOption[order] || orderByOption['recent'],
      skip: parseInt(offset),
      take: parseInt(limit),
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.status(200).send(article);
  };
  static createArticle = async (req, res) => {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).send(article);
  };
  static getArticleDetail = async (req, res) => {
    const { id } = parseInt(req.params.id, 10);
    const article = await prisma.article.findUniqueOrThrow({
      where: { id },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.status(200).send(article);
  };
  static patchArticle = async (req, res) => {
    const { id } = parseInt(req.params.id, 10);
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id },
      data: { title, content },
    });
    res.status(200).send(article);
  };
  static deleteArticle = async (req, res) => {
    const { id } = parseInt(req.params.id, 10);
    await prisma.article.delete({
      where: { id },
    });
    res.sendStatus(204);
  };
}
