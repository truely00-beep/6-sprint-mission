import prisma from '../lib/prisma.js';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStructs.js';
import { CreateComment } from '../structs/commentStructs.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

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

    //게시물 목록 가져오기
    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    //로그인 유저 아이디 가져오기
    const userId = req.user.id;

    //로그인 유저가 좋아요한 게시물 조회
    const likeList = await prisma.like.findMany({
      where: {
        userId,
        articleId: { not: null },
      },
      select: { articleId: true },
    });

    const likeIds = likeList.map((item) => item.articleId);

    //각 상품에 불린값 추가
    const result = articles.map((a) => ({
      ...a,
      isLiked: likeIds.includes(a.id),
    }));
    res.send(result);
  }
  async createArticle(req, res) {
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
  async getArticleById(req, res) {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });

    if (!article) throw new NotFoundError('해당 게시글이 없습니다.');

    //로그인 유저 가져오기
    const userId = req.user.id;

    //유저가 해당 게시글에 좋아요 눌렀는지 조회
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        articleId: Number(id),
      },
    });

    //반환
    return res.send({
      ...article,
      isLiked: Boolean(existingLike),
    });
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
