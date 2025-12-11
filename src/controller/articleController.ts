import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStructs';
import { CreateComment } from '../structs/commentStructs';
import { AuthenticatedRequest } from '../types/auth.js';
import articleService from '../service/articleService';

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

    const articles = await articleService.getArticles(
      parseInt(offset),
      parseInt(limit),
      order,
      search,
    );
    res.send(articles);
  }
  async createArticle(req: AuthenticatedRequest, res: Response) {
    assert(req.body, CreateArticle);

    const newArticle = await articleService.createArticle({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).send(newArticle);
  }
  async getArticleById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const article = await articleService.getArticleById(id);
    res.send(article);
  }
  async updateArticle(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    assert(req.body, PatchArticle);

    const id = Number(req.params.id);
    const loginUser = req.user;

    const updatedArticle = await articleService.updateArticle(id, req.body, loginUser.id);
    res.send(updatedArticle);
  }
  async deleteArticle(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    const id = Number(req.params.id);

    const loginUser = req.user;
    await articleService.deleteArticle(id, loginUser.id);
    res.status(204).send();
  }
  async createComment(req: AuthenticatedRequest, res: Response) {
    assert(req.body, CreateComment);

    const articleId = Number(req.params.id);
    const { content } = req.body;
    const loginUser = req.user;

    const comments = await articleService.createComment({
      content,
      articleId,
      userId: loginUser.id,
    });
    res.status(201).send(comments);
  }
  async getComment(
    req: Request<{ id: string }, any, any, { cursor?: number; limit?: string }>,
    res: Response,
  ) {
    const articleId = Number(req.params.id);
    const cursor = req.query.cursor;
    const limit = parseInt(req.query.limit || '10');

    const comments = await articleService.getComments(articleId, cursor, limit);
    res.send(comments);
  }
}

export default new ArticleController();
