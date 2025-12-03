import { ArticleRepository } from '../repositories/articleRepository.js';
import { CommentRepository } from '../repositories/commentRepository.js';
import { LikeRepository } from '../repositories/likeRepository.js';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  ArticleWithLikes,
  ArticleListResponse,
  PageParams,
  CreateCommentDTO,
  CommentListResponse,
  CursorParams,
} from '../types/dto.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export class ArticleService {
  private articleRepository: ArticleRepository;
  private commentRepository: CommentRepository;
  private likeRepository: LikeRepository;

  constructor() {
    this.articleRepository = new ArticleRepository();
    this.commentRepository = new CommentRepository();
    this.likeRepository = new LikeRepository();
  }

  async createArticle(userId: number, data: CreateArticleDTO) {
    return this.articleRepository.create({ ...data, userId });
  }

  async getArticle(id: number, userId?: number): Promise<ArticleWithLikes> {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('article', id);
    }

    const { likes, ...articleWithoutLikes } = article;
    return {
      ...articleWithoutLikes,
      likeCount: likes.length,
      isLiked: userId ? likes.some((like) => like.userId === userId) : undefined,
    };
  }

  async updateArticle(id: number, userId: number, data: UpdateArticleDTO) {
    const existingArticle = await this.articleRepository.findByIdWithoutRelations(id);
    if (!existingArticle) {
      throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the article');
    }

    return this.articleRepository.update(id, data);
  }

  async deleteArticle(id: number, userId: number): Promise<void> {
    const existingArticle = await this.articleRepository.findByIdWithoutRelations(id);
    if (!existingArticle) {
      throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the article');
    }

    await this.articleRepository.delete(id);
  }

  async getArticleList(params: PageParams, userId?: number): Promise<ArticleListResponse> {
    const { articles, totalCount } = await this.articleRepository.findMany(params);

    const articlesWithLikes: ArticleWithLikes[] = articles.map((article) => ({
      ...article,
      likes: undefined,
      likeCount: article.likes.length,
      isLiked: userId ? article.likes.some((like) => like.userId === userId) : undefined,
    }));

    return {
      list: articlesWithLikes,
      totalCount,
    };
  }

  async createComment(articleId: number, userId: number, data: CreateCommentDTO) {
    const existingArticle = await this.articleRepository.findByIdWithoutRelations(articleId);
    if (!existingArticle) {
      throw new NotFoundError('article', articleId);
    }

    return this.commentRepository.create({
      articleId,
      content: data.content,
      userId,
    });
  }

  async getCommentList(articleId: number, params: CursorParams): Promise<CommentListResponse> {
    const article = await this.articleRepository.findByIdWithoutRelations(articleId);
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const commentsWithCursor = await this.commentRepository.findManyByArticleId({
      ...params,
      articleId,
    });
    const comments = commentsWithCursor.slice(0, params.limit);
    const cursorComment = commentsWithCursor[comments.length];
    const nextCursor = cursorComment ? cursorComment.id : null;

    return {
      list: comments,
      nextCursor,
    };
  }

  async createLike(articleId: number, userId: number): Promise<void> {
    const existingArticle = await this.articleRepository.findByIdWithoutRelations(articleId);
    if (!existingArticle) {
      throw new NotFoundError('article', articleId);
    }

    const existingLike = await this.likeRepository.findFirst(articleId, userId);
    if (existingLike) {
      throw new BadRequestError('Already liked');
    }

    await this.likeRepository.create(articleId, userId);
  }

  async deleteLike(articleId: number, userId: number): Promise<void> {
    const existingArticle = await this.articleRepository.findByIdWithoutRelations(articleId);
    if (!existingArticle) {
      throw new NotFoundError('article', articleId);
    }

    const existingLike = await this.likeRepository.findFirst(articleId, userId);
    if (!existingLike) {
      throw new BadRequestError('Not liked');
    }

    await this.likeRepository.delete(existingLike.id);
  }
}

