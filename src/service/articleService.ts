import articleRepository from '../repository/articleRepository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';

class ArticleService {
  //게시물 목록 조회
  async getArticles(offset: number, limit: number, order: string, search: string) {
    const orderBy = order === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return articleRepository.findAllArticles(where, orderBy, offset, limit);
  }
  //게시물 생성
  async createArticle(data: { title: string; content: string; userId: number }) {
    return articleRepository.createArticle(data);
  }
  //게시물 상세 조회
  async getArticleById(id: number) {
    const article = await articleRepository.findArticleById(id);

    if (!article) {
      throw new NotFoundError('게시글이 존재하지 않습니다.');
    }

    return article;
  }
  //게시물 수정
  async updateArticle(
    id: number,
    data: Partial<{ title: string; content: string }>,
    loginUserId: number,
  ) {
    const existingArticle = await articleRepository.findArticleById(id);

    if (!existingArticle) {
      throw new NotFoundError('게시글이 존재하지 않습니다.');
    }
    if (existingArticle.userId !== loginUserId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    return articleRepository.updateArticle(id, data);
  }
  //게시물 삭제
  async deleteArticle(id: number, loginUserId: number) {
    const existingArticle = await articleRepository.findArticleById(id);

    if (!existingArticle) {
      throw new NotFoundError('게시글이 존재하지 않습니다.');
    }

    if (existingArticle.userId !== loginUserId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    return articleRepository.deleteArticle(id);
  }
  //댓글 생성
  async createComment(data: { content: string; userId: number; articleId: number }) {
    return articleRepository.createComment(data);
  }
  //댓글 목록 조회
  async getComments(articleId: number, cursor: number | undefined, limit: number) {
    const comments = await articleRepository.getComments(articleId, cursor, limit);
    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

    return { data: comments, nextCursor };
  }
}

export default new ArticleService();
