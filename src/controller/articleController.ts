import prisma from '../lib/prisma';
import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStructs';
import { CreateComment } from '../structs/commentStructs';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { AuthenticatedRequest } from '../types/auth.js';

class ArticleController {
  async getArticles(
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
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const where: object = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    //게시물 목록 가져오기
    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    res.send(articles);
  }
  async createArticle(req: AuthenticatedRequest, res: Response) {
    assert(req.body, CreateArticle);
    const userId = req.user.id;

    const articles = await prisma.article.create({
      data: {
        ...req.body,
        userId,
      },
    });
    res.status(201).send(articles);
  }
  async getArticleById(req: Request, res: Response) {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });

    if (!article) throw new NotFoundError('해당 게시글이 없습니다.');

    //반환
    return res.send(article);
  }
  async updateArticle(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    assert(req.body, PatchArticle);

    const { id } = req.params;
    const loginUser = req.user;
    const existingArticle = await prisma.article.findUnique({ where: { id } });

    if (!existingArticle) {
      throw new NotFoundError('게시글이 존재하지 않습니다.');
    }

    if (loginUser.id !== existingArticle.userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const articles = await prisma.article.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.send(articles);
  }
  async deleteArticle(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    const { id } = req.params;

    const loginUser = req.user;
    const existingArticle = await prisma.article.findUnique({ where: { id } });

    if (!existingArticle) {
      throw new NotFoundError('게시글이 존재하지 않습니다.');
    }

    if (loginUser.id !== existingArticle.userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const articles = await prisma.article.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  }
  async createComment(req: Request, res: Response) {
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
  async getComment(
    req: Request<{ id: string }, any, any, { cursor?: number; limit?: string }>,
    res: Response,
  ) {
    const { id: articleId } = req.params;
    const { cursor, limit = '10' } = req.query;

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

    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

    res.send({
      data: comments,
      nextCursor,
    });
  }
}

export default new ArticleController();
