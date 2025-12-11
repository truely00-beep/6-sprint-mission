import prisma from '../lib/prisma';

class ArticleRepository {
  async findArticleById(id: number) {
    return prisma.article.findUnique({ where: { id } });
  }

  async updateArticle(id: number, data: Partial<{ title: string; content: string }>) {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  async deleteArticle(id: number) {
    return prisma.article.delete({
      where: { id },
    });
  }

  async createArticle(data: { title: string; content: string; userId: number }) {
    return prisma.article.create({
      data,
    });
  }

  async findAllArticles(where: object, orderBy: object, offset: number, limit: number) {
    return prisma.article.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
    });
  }

  async createComment(data: { content: string; userId: number; articleId: number }) {
    return prisma.comment.create({
      data,
    });
  }

  async getComments(articleId: number, cursor: number | undefined, limit: number) {
    return prisma.comment.findMany({
      where: { articleId: Number(articleId) },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      take: limit,
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
  }
}

export default new ArticleRepository();
